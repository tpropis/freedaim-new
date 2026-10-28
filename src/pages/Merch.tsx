import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useGSAP } from "@gsap/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Ornament from "@/components/declaration/Ornament";
import { useInk } from "@/components/declaration/useInk";
import { gsap, reducedMotion } from "@/lib/motion";
import { fetchProducts, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const PEOPLE_GUIDE_PATH = "/250";
const ICONIC_AMERICANS_PRICE = "45.47";
const PROMO_CODE = "LOLgbtq";

const isIconicAmericansDrop = (product: ShopifyProduct) =>
  product.node.title.toLowerCase().includes("250 iconic americans");

const displayPriceFor = (product: ShopifyProduct) => {
  const price = product.node.priceRange.minVariantPrice;
  return {
    currencyCode: price.currencyCode,
    amount: isIconicAmericansDrop(product) ? ICONIC_AMERICANS_PRICE : price.amount,
  };
};

const money = (amount: string, currency: string) => (currency === "USD" ? "$" : `${currency} `) + parseFloat(amount).toFixed(2);

// The merch store as "The General Store": a founding-era printed catalog.
export default function Merch() {
  const root = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [copied, setCopied] = useState(false);
  useInk(root);

  const copyCode = async () => {
    await navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    toast.success(`Code copied: ${PROMO_CODE}`, { position: "top-center" });
    setTimeout(() => setCopied(false), 1800);
  };

  // the "Copied" stamp lands on the coupon
  useGSAP(
    () => {
      if (!copied || reducedMotion) return;
      gsap.fromTo(".coupon-stamp", { autoAlpha: 0, scale: 1.9, rotate: -30 }, { autoAlpha: 1, scale: 1, rotate: -12, duration: 0.4, ease: "back.out(2.2)" });
    },
    { dependencies: [copied], scope: root }
  );

  useEffect(() => {
    document.title = "Merch — freedaim";
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
    <div ref={root} className="theme-paper min-h-screen">
      <Navbar showCart tone="paper" />

      {/* masthead */}
      <section className="mx-auto max-w-[1180px] px-5 pb-14 pt-32 text-center md:px-10 md:pt-40">
        <p data-ink="fade" className="smallcaps text-ink-muted">
          The General Store <span className="text-ink-red">★</span> freedaim Merch
        </p>
        <h1 data-ink="press" className="mt-5 font-wood text-[clamp(3.6rem,11vw,8.4rem)] leading-[0.88] tracking-[0.01em]">
          Wear the Mission.
        </h1>
        <p data-ink="wipe" className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.3rem)] italic text-ink-red">
          Premium drops for the ones building their own dream.
        </p>

        {/* the 13 Colonies code, printed as a tear-off coupon */}
        <div data-ink="fade" className="mt-12 flex flex-col items-center">
          <button
            type="button"
            onClick={copyCode}
            className="group relative border-2 border-dashed border-ink/60 bg-paper-light px-8 py-5 text-center shadow-[5px_5px_0_rgba(23,20,15,0.12)] transition-transform duration-200 hover:-rotate-1"
            aria-label={`Copy discount code ${PROMO_CODE}`}
          >
            <span className="smallcaps block text-[10px] text-ink-muted">Coupon No. 13 · One per founding patriot</span>
            <span className="mt-2 block font-wood text-3xl tracking-[0.06em] text-ink-red md:text-4xl">13 Colonies, 13 Off</span>
            <span className="mt-2 block font-type text-lg text-ink">
              CODE: <strong className="tracking-[0.08em]">{PROMO_CODE}</strong>
            </span>
            <span className="smallcaps mt-3 block text-[10px] text-ink-muted group-hover:text-ink">
              {copied ? "Copied to clipboard" : "Tap to copy"}
            </span>
            {copied && (
              <span className="coupon-stamp pointer-events-none absolute -right-6 -top-5 border-[3px] border-ink-red bg-paper-light/80 px-3 py-1 font-wood text-2xl tracking-[0.1em] text-ink-red">
                Copied
              </span>
            )}
          </button>
          <p className="mt-4 font-caslon text-sm italic text-ink-muted">Apply at checkout for $13 off.</p>
        </div>

        {/* the shirt roster, set as a printed notice */}
        <Link
          data-ink="fade"
          to={PEOPLE_GUIDE_PATH}
          className="group mx-auto mt-12 flex max-w-[760px] flex-col items-center gap-2 border-y-[3px] border-double border-ink py-4 sm:flex-row sm:justify-center sm:gap-4"
          aria-label="Open the 250 Iconic Americans guide"
        >
          <span className="smallcaps text-ink-red">Shirt Roster</span>
          <span className="font-caslon text-[17px]">Who made the shirt? Open the 250-person chaos report.</span>
          <span className="font-caslon font-bold text-ink-red transition-transform group-hover:translate-x-1">/250 →</span>
        </Link>
      </section>

      <Ornament />

      {/* the catalog */}
      <section className="mx-auto max-w-[1240px] px-5 pb-24 pt-14 md:px-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2 className="h-7 w-7 animate-spin text-ink-red" />
            <p className="smallcaps text-ink-muted">Setting the type…</p>
          </div>
        ) : products.length === 0 ? (
          <div className="border border-ink/30 py-24 text-center">
            <p className="font-display text-2xl">No products found.</p>
            <p className="mt-2 font-caslon italic text-ink-muted">The shelves are being restocked. Check back soon.</p>
          </div>
        ) : (
          <div className={products.length === 1 ? "flex justify-center" : "grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3"}>
            {products.map((p, idx) => {
              const img = p.node.images.edges[0]?.node;
              const price = displayPriceFor(p);
              const available = p.node.variants.edges.some((v) => v.node.availableForSale);
              const hasOptions = p.node.options.some((o) => !(o.values.length === 1 && o.values[0] === "Default Title"));
              const isRosterShirt = isIconicAmericansDrop(p);
              return (
                <article key={p.node.id} data-ink="fade" className={`group ${products.length === 1 ? "w-full max-w-[440px]" : ""}`}>
                  <Link
                    to={`/product/${p.node.handle}`}
                    className="relative block border border-ink bg-white shadow-[6px_6px_0_rgba(23,20,15,0.12)] transition-shadow duration-300 group-hover:shadow-[6px_6px_0_#B5242E]"
                  >
                    <span className="smallcaps absolute left-3 top-3 z-10 bg-paper-light/90 px-2 py-1 text-[10px] text-ink">
                      No. {String(idx + 1).padStart(3, "0")}
                    </span>
                    <div className="aspect-[4/5] overflow-hidden">
                      {img ? (
                        <img
                          src={img.url}
                          alt={img.altText || p.node.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-caslon italic text-ink-muted">No image</div>
                      )}
                    </div>
                  </Link>

                  <div className="mt-5">
                    <Link to={`/product/${p.node.handle}`} className="flex items-baseline gap-3">
                      <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-ink-red">{p.node.title}</h3>
                      <span className="mb-[6px] min-w-6 flex-1 border-b border-dotted border-ink/40" aria-hidden="true" />
                      <span className="font-caslon text-lg">{money(price.amount, price.currencyCode)}</span>
                    </Link>

                    {isRosterShirt && (
                      <Link
                        to={PEOPLE_GUIDE_PATH}
                        className="mt-4 flex items-center justify-between gap-3 border-y border-ink/25 py-3 transition-colors hover:border-ink-red"
                        aria-label="See who is on the 250 Iconic Americans shirt"
                      >
                        <span>
                          <span className="smallcaps block text-[10px] text-ink-red">ID the lineup</span>
                          <span className="block font-caslon text-sm italic text-ink-soft">
                            Before your uncle starts yelling “who is that guy?”
                          </span>
                        </span>
                        <span className="shrink-0 font-caslon font-bold text-ink-red">/250</span>
                      </Link>
                    )}

                    <div className="mt-5">
                      {!available ? (
                        <span className="btn-outline-ink w-full cursor-not-allowed justify-center opacity-50">Sold Out</span>
                      ) : hasOptions ? (
                        <Link to={`/product/${p.node.handle}`} className="btn-press w-full justify-center">
                          Select Size <span aria-hidden="true">→</span>
                        </Link>
                      ) : (
                        <button onClick={() => handleAdd(p)} disabled={isLoading} className="btn-press w-full justify-center disabled:opacity-50">
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Cart"}
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer tone="paper" />
    </div>
  );
}
