import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const ICONIC_AMERICANS_PRICE = "45.47";

const money = (amount: string, currency: string) => (currency === "USD" ? "$" : `${currency} `) + parseFloat(amount).toFixed(2);

const getDisplayPrice = (item: ReturnType<typeof useCartStore.getState>["items"][number]) => ({
  currencyCode: item.price.currencyCode,
  amount: item.product.node.title.toLowerCase().includes("250 iconic americans")
    ? ICONIC_AMERICANS_PRICE
    : item.price.amount,
});

export const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } =
    useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + parseFloat(getDisplayPrice(i).amount) * i.quantity, 0);

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center border border-foreground/25 text-foreground transition-colors hover:border-foreground"
          aria-label={totalItems > 0 ? `Open cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}` : "Open cart"}
        >
          <ShoppingCart className="h-[18px] w-[18px]" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center bg-ink-red px-1 font-caslon text-[11px] font-bold text-paper-light">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      {/* the drawer renders in a portal outside the page, so it carries the paper theme itself */}
      <SheetContent className="theme-paper flex h-full w-full flex-col border-l border-ink sm:max-w-lg">
        <SheetHeader className="text-left">
          <p className="smallcaps text-[11px] text-ink-muted">
            The General Store <span className="text-ink-red">★</span> Order Slip
          </p>
          <SheetTitle className="font-display text-3xl font-normal">Your Order</SheetTitle>
          <SheetDescription className="font-caslon italic text-ink-muted">
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          </SheetDescription>
        </SheetHeader>
        <div className="double-rule mt-4" />
        <div className="flex min-h-0 flex-1 flex-col pt-6">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="mx-auto mb-4 h-10 w-10 text-ink-muted" />
                <p className="font-caslon italic text-ink-muted">Nothing here yet</p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                <ul className="divide-y divide-ink/20">
                  {items.map((item) => {
                    const displayPrice = getDisplayPrice(item);
                    return (
                      <li key={item.variantId} className="flex gap-4 py-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden border border-ink bg-white">
                          {item.product.node.images?.edges?.[0]?.node && (
                            <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-display text-lg leading-tight">{item.product.node.title}</h4>
                          <p className="smallcaps mt-1 text-[10px] text-ink-muted">{item.selectedOptions.map((o) => o.value).join(" · ")}</p>
                          <p className="mt-2 font-caslon">{money(displayPrice.amount, displayPrice.currencyCode)}</p>
                        </div>
                        <div className="flex flex-shrink-0 flex-col items-end justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => removeItem(item.variantId)}
                            className="text-ink-muted transition-colors hover:text-ink-red"
                            aria-label={`Remove ${item.product.node.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="flex items-center border border-ink/40">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-ink hover:text-paper-light"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-caslon text-sm">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center transition-colors hover:bg-ink hover:text-paper-light"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex-shrink-0 space-y-5 border-t-[3px] border-double border-ink pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="smallcaps text-ink-muted">Subtotal</span>
                  <span className="mb-[5px] flex-1 border-b border-dotted border-ink/40" aria-hidden="true" />
                  <span className="font-display text-2xl">{money(totalPrice.toFixed(2), items[0]?.price.currencyCode || "USD")}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn-press w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" />
                      Secure Checkout
                    </>
                  )}
                </button>
                <p className="text-center font-caslon text-xs italic text-ink-muted">Checkout opens securely with Shopify.</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
