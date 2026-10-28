import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const PEOPLE_GUIDE_PATH = "/250";
const ICONIC_AMERICANS_PRICE = "45.47";

const isIconicAmericansDrop = (product: ShopifyProduct) =>
  product.node.title.toLowerCase().includes("250 iconic americans");

const displayPriceFor = (product: ShopifyProduct) => {
  const price = product.node.priceRange.minVariantPrice;
  return {
    currencyCode: price.currencyCode,
    amount: isIconicAmericansDrop(product) ? ICONIC_AMERICANS_PRICE : price.amount,
  };
};

export default function Merch() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText("LOLgbtq");
    setCopied(true);
    toast.success("Code copied: LOLgbtq", { position: "top-center" });
    setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    document.title = "Merch — Freedaim";
    fetchProducts(50)
      .then(setProducts)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (p: ShopifyProduct) => {
    const variant = p.node.variants.edges.find((v) => v.node.availableForSale)?.node;
    if (!variant) {
      toast.error("This item is out of stock");
      return;
    }
    await addItem({
      product: p,
      variantId: variant.id,
      variantTitle: variant.title,
      price: displayPriceFor(p),
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground">
      <Navbar showCart />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,58,78,0.12),_transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.3em] text-crimson font-semibold mb-4"
          >
            Freedaim Merch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          >
            Wear the Mission.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            Premium drops for the ones building their own dream.
          </motion.p>

          {/* Promo banner — 13 Colonies gag */}
          <motion.button
            type="button"
            onClick={copyCode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-crimson/50 bg-crimson/10 px-5 py-2.5 text-sm font-semibold text-foreground backdrop-blur-sm hover:border-crimson hover:bg-crimson/20 hover:shadow-[0_0_30px_-8px_rgba(212,58,78,0.6)] transition-all"
            aria-label="Copy discount code LOLgbtq"
          >
            <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-crimson">
              13 colonies, 13 off
            </span>
            <span className="font-black tracking-wide">
              CODE: <span className="text-crimson">LOLgbtq</span>
            </span>
            {copied ? (
              <Check size={14} className="text-crimson" />
            ) : (
              <Copy size={14} className="opacity-70 group-hover:opacity-100" />
            )}
          </motion.button>
          <p className="mt-3 text-xs text-muted-foreground/80">
            Tap to copy. Apply at checkout for $13 off — one per founding patriot.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-8 max-w-2xl border-y border-border/60 py-4"
          >
            <Link
              to={PEOPLE_GUIDE_PATH}
              className="group flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4"
              aria-label="Open the 250 Iconic Americans guide"
            >
              <span className="text-xs font-black uppercase tracking-[0.24em] text-crimson">
                Shirt roster
              </span>
              <span className="text-sm font-semibold text-foreground sm:text-base">
                Who made the shirt? Open the 250-person chaos report.
              </span>
              <span className="text-sm font-black text-crimson transition-transform group-hover:translate-x-1">
                /250 →
              </span>
            </Link>
          </motion.div>
        </div>
      </section>



      {/* Products */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-crimson" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 border border-border/40 rounded-xl">
              <p className="text-muted-foreground">No products found.</p>
            </div>
          ) : (
            <div
              className={
                products.length === 1
                  ? "flex justify-center"
                  : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              }
            >
              {products.map((p, idx) => {
                const img = p.node.images.edges[0]?.node;
                const price = displayPriceFor(p);
                const available = p.node.variants.edges.some((v) => v.node.availableForSale);
                const hasOptions = p.node.options.some(
                  (o) => !(o.values.length === 1 && o.values[0] === "Default Title")
                );
                const isRosterShirt = isIconicAmericansDrop(p);
                // Card sizing — tweak these to control card dimensions per breakpoint.
                const cardSize = "w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[380px] mx-auto";
                const imageHeight = "h-64 sm:h-72 md:h-80 lg:h-[340px]";
                return (
                  <motion.div
                    key={p.node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`group relative rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-crimson/60 hover:shadow-[0_0_40px_-12px_rgba(212,58,78,0.4)] transition-all ${cardSize}`}
                  >
                    <Link to={`/product/${p.node.handle}`} className="block">
                      <div className={`${imageHeight} bg-secondary/10 overflow-hidden`}>
                        {img ? (
                          <img
                            src={img.url}
                            alt={img.altText || p.node.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-5">
                      <Link to={`/product/${p.node.handle}`}>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-crimson transition-colors">
                          {p.node.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-3">
                        {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
                      </p>
                      {isRosterShirt && (
                        <Link
                          to={PEOPLE_GUIDE_PATH}
                          className="mb-4 flex items-center justify-between gap-3 border-y border-border/60 py-3 text-left transition-colors hover:border-crimson/70"
                          aria-label="See who is on the 250 Iconic Americans shirt"
                        >
                          <span>
                            <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-crimson">
                              ID the lineup
                            </span>
                            <span className="block text-xs font-semibold text-foreground">
                              Before your uncle starts yelling “who is that guy?”
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-black text-crimson">/250</span>
                        </Link>
                      )}
                      {hasOptions ? (
                        <Button
                          asChild
                          disabled={!available}
                          className="w-full bg-crimson hover:bg-crimson-glow text-primary-foreground font-bold uppercase tracking-wide"
                        >
                          <Link to={`/product/${p.node.handle}`}>
                            {!available ? "Sold Out" : "Select Size"}
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleAdd(p)}
                          disabled={isLoading || !available}
                          className="w-full bg-crimson hover:bg-crimson-glow text-primary-foreground font-bold uppercase tracking-wide"
                        >
                          {!available ? "Sold Out" : isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

          )}
        </div>
      </section>
    </div>
  );
}
