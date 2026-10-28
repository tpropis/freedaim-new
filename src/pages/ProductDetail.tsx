import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInk } from "@/components/declaration/useInk";
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

const money = (amount: string, currency: string) => (currency === "USD" ? "$" : `${currency} `) + parseFloat(amount).toFixed(2);

// A single item from the General Store, laid out like a catalog page.
export default function ProductDetail() {
  const root = useRef<HTMLDivElement>(null);
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  useInk(root);

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
          document.title = `${p.node.title} — freedaim Merch`;
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
    <div ref={root} className="theme-paper min-h-screen">
      <Navbar showCart tone="paper" />

      <main className="mx-auto max-w-[1180px] px-5 pb-24 pt-28 md:px-10 md:pt-32">
        <Link to="/merch" className="smallcaps inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink-red">
          <span aria-hidden="true">←</span> Back to the General Store
        </Link>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-28">
            <Loader2 className="h-7 w-7 animate-spin text-ink-red" />
            <p className="smallcaps text-ink-muted">Setting the type…</p>
          </div>
        ) : !product ? (
          <p className="py-24 font-display text-2xl">Product not found.</p>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* the plate */}
            <div>
              <div className="aspect-square overflow-hidden border border-ink bg-white shadow-[6px_6px_0_rgba(23,20,15,0.12)]">
                {product.node.images.edges[activeImage] && (
                  <img src={product.node.images.edges[activeImage].node.url} alt={product.node.title} className="h-full w-full object-cover" />
                )}
              </div>
              {product.node.images.edges.length > 1 && (
                <div className="mt-4 grid grid-cols-5 gap-3">
                  {product.node.images.edges.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      aria-label={`Show image ${i + 1}`}
                      aria-pressed={activeImage === i}
                      className={`aspect-square overflow-hidden border bg-white transition-shadow ${
                        activeImage === i ? "border-ink shadow-[3px_3px_0_#B5242E]" : "border-ink/30 hover:border-ink"
                      }`}
                    >
                      <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* the particulars */}
            <div>
              <p data-ink="fade" className="smallcaps text-ink-muted">
                The General Store <span className="text-ink-red">★</span> freedaim Merch
              </p>
              <h1 data-ink="wipe" className="mt-4 font-display text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.02]">
                {product.node.title}
              </h1>
              <p className="mt-4 font-caslon text-3xl text-ink">
                {displayedPrice ? money(displayedPrice.amount, displayedPrice.currencyCode) : ""}
              </p>

              {isIconicAmericansDrop(product) && (
                <Link
                  to={PEOPLE_GUIDE_PATH}
                  className="mt-6 flex items-center justify-between gap-4 border-y-[3px] border-double border-ink py-4 transition-colors hover:border-ink-red"
                  aria-label="Open the 250 Iconic Americans guide"
                >
                  <span>
                    <span className="smallcaps block text-[11px] text-ink-muted">Shirt witness protection list</span>
                    <span className="mt-1 block font-caslon italic text-ink-soft">
                      Tap here before you spend 45 minutes zooming in like the FBI.
                    </span>
                  </span>
                  <span className="shrink-0 font-caslon font-bold text-ink underline decoration-1 underline-offset-4">/250 →</span>
                </Link>
              )}

              <div
                className="mt-8 max-w-none font-caslon text-[17px] leading-[1.65] text-ink-soft [&_a]:text-ink [&_a]:underline [&_li]:my-1 [&_p]:my-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: product.node.description.replace(/\n/g, "<br/>") }}
              />

              {product.node.options
                .filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"))
                .map((opt) => (
                  <div key={opt.name} className="mt-8">
                    <p className="smallcaps text-[11px] text-ink-muted">{opt.name}</p>
                    <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={opt.name}>
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          role="radio"
                          aria-checked={selectedOptions[opt.name] === val}
                          onClick={() => setSelectedOptions({ ...selectedOptions, [opt.name]: val })}
                          className={`min-w-[3.2rem] border-[1.5px] px-4 py-2 font-caslon text-sm transition-colors ${
                            selectedOptions[opt.name] === val ? "border-ink bg-ink text-paper-light" : "border-ink/40 text-ink hover:border-ink"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              <button
                onClick={handleAdd}
                disabled={isLoading || !matchedVariant?.availableForSale}
                className="btn-press mt-10 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : !matchedVariant?.availableForSale ? (
                  "Sold Out"
                ) : (
                  <>
                    Add to Cart <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer tone="paper" />
    </div>
  );
}
