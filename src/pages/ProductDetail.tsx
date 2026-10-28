import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const PEOPLE_GUIDE_PATH = "/250";
const ICONIC_AMERICANS_PRICE = "45.47";

const isIconicAmericansDrop = (product: ShopifyProduct) =>
  product.node.title.toLowerCase().includes("250 iconic americans");

const displayPriceFor = (
  product: ShopifyProduct,
  price?: { amount: string; currencyCode: string }
) => {
  const fallback = product.node.priceRange.minVariantPrice;
  const source = price ?? fallback;
  return {
    currencyCode: source.currencyCode,
    amount: isIconicAmericansDrop(product) ? ICONIC_AMERICANS_PRICE : source.amount,
  };
};

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    if (!handle) return;
    fetchProductByHandle(handle)
      .then((p) => {
        setProduct(p);
        if (p) {
          const first = p.node.variants.edges[0]?.node;
          if (first) {
            const opts: Record<string, string> = {};
            first.selectedOptions.forEach((o) => (opts[o.name] = o.value));
            setSelectedOptions(opts);
          }
          document.title = `${p.node.title} — Freedaim Merch`;
        }
      })
      .finally(() => setLoading(false));
  }, [handle]);

  const matchedVariant = product?.node.variants.edges.find((v) =>
    v.node.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
  )?.node;

  const displayedPrice = product ? displayPriceFor(product, matchedVariant?.price) : null;

  const handleAdd = async () => {
    if (!product || !matchedVariant) return;
    if (!matchedVariant.availableForSale) {
      toast.error("This variant is sold out");
      return;
    }
    await addItem({
      product,
      variantId: matchedVariant.id,
      variantTitle: matchedVariant.title,
      price: displayPriceFor(product, matchedVariant.price),
      quantity: 1,
      selectedOptions: matchedVariant.selectedOptions,
    });
    toast.success("Added to cart", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Navbar showCart />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/merch"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Merch
          </Link>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-crimson" />
            </div>
          ) : !product ? (
            <p className="text-muted-foreground">Product not found.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            >
              <div>
                <div className="aspect-square rounded-xl overflow-hidden border border-border/40 bg-secondary/10 mb-4">
                  {product.node.images.edges[activeImage] && (
                    <img
                      src={product.node.images.edges[activeImage].node.url}
                      alt={product.node.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {product.node.images.edges.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.node.images.edges.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                          activeImage === i ? "border-crimson" : "border-border/40"
                        }`}
                      >
                        <img src={img.node.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                  {product.node.title}
                </h1>
                <p className="text-2xl font-bold text-crimson mb-6">
                  {displayedPrice?.currencyCode} {displayedPrice ? parseFloat(displayedPrice.amount).toFixed(2) : ""}
                </p>

                {isIconicAmericansDrop(product) && (
                  <Link
                    to={PEOPLE_GUIDE_PATH}
                    className="mb-6 flex items-center justify-between gap-4 border-y border-border/60 py-4 transition-colors hover:border-crimson/70"
                    aria-label="Open the 250 Iconic Americans guide"
                  >
                    <span>
                      <span className="block text-xs font-black uppercase tracking-[0.22em] text-crimson">
                        Shirt witness protection list
                      </span>
                      <span className="block text-sm font-semibold text-foreground">
                        Tap here before you spend 45 minutes zooming in like the FBI.
                      </span>
                    </span>
                    <span className="shrink-0 text-sm font-black text-crimson">/250 →</span>
                  </Link>
                )}

                <div
                  className="prose prose-invert text-muted-foreground mb-8 max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.node.description.replace(/\n/g, "<br/>") }}
                />

                {product.node.options
                  .filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"))
                  .map((opt) => (
                    <div key={opt.name} className="mb-6">
                      <p className="text-sm font-semibold uppercase tracking-wider mb-2">
                        {opt.name}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {opt.values.map((val) => (
                          <button
                            key={val}
                            onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: val })}
                            className={`px-4 py-2 rounded-md border text-sm font-medium transition-all ${
                              selectedOptions[opt.name] === val
                                ? "border-crimson bg-crimson/10 text-foreground"
                                : "border-border/60 text-muted-foreground hover:border-foreground/40"
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                <Button
                  onClick={handleAdd}
                  disabled={isLoading || !matchedVariant?.availableForSale}
                  size="lg"
                  className="w-full bg-crimson hover:bg-crimson-glow text-primary-foreground font-bold uppercase tracking-wide"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : !matchedVariant?.availableForSale ? (
                    "Sold Out"
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
