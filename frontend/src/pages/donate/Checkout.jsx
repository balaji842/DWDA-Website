import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useLang, useStrings } from "../../context/LanguageContext.jsx";
import { useBasket } from "../../context/BasketContext.jsx";
import PageHero from "../../components/PageHero.jsx";
import { EmptyState } from "../../components/States.jsx";
import { D, money } from "./strings.js";
import { TestModeNote } from "./parts.jsx";
import DonorForm from "./DonorForm.jsx";

export default function Checkout() {
  const s = useStrings(D);
  const { lang, tx } = useLang();
  const basket = useBasket();
  const build = () => (basket.count ? { type: "need", items: basket.items.map((i) => ({ need: i.need._id, quantity: i.quantity })) } : { errors: { basket: s.empty } });
  return (
    <>
      <PageHero title={s.basket} crumbs={[["/donate", s.crumb], ["/donate/needs", s.need]]} />
      <section className="section">
        <div className="container">
          {!basket.count ? (
            <EmptyState title={s.empty} action={<Link className="btn btn-primary" to="/donate/needs">{s.browseNeeds}</Link>} />
          ) : (
            <div className="don-layout">
              <div className="card form-card">
                <TestModeNote />
                <DonorForm build={build} amount={basket.total} onCreated={() => basket.clear()} />
              </div>
              <aside className="card card-pad don-summary">
                <h2>{s.basket}</h2>
                <ul className="basket-list">
                  {basket.items.map(({ need, quantity }) => (
                    <li key={need._id}>
                      <div><strong>{tx(need.title)}</strong><span className="muted">{need.institution?.name} · {money(need.unitCost, lang)} × {quantity}</span></div>
                      <div className="basket-row">
                        <div className="stepper stepper-sm" role="group" aria-label={`${s.qty}: ${tx(need.title)}`}>
                          <button type="button" onClick={() => basket.setQuantity(need._id, quantity - 1)} disabled={quantity <= 1} aria-label="−1"><Minus aria-hidden="true" /></button>
                          <span aria-live="polite">{quantity}</span>
                          <button type="button" onClick={() => basket.setQuantity(need._id, quantity + 1)} disabled={quantity >= need.quantityRemaining} aria-label="+1"><Plus aria-hidden="true" /></button>
                        </div>
                        <strong>{money(quantity * need.unitCost, lang)}</strong>
                        <button type="button" className="icon-btn" onClick={() => basket.remove(need._id)} aria-label={`${s.remove} ${tx(need.title)}`}><Trash2 aria-hidden="true" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="basket-total"><span>{s.total}</span><strong>{money(basket.total, lang)}</strong></p>
                <Link to="/donate/needs" className="link-arrow">{s.browseNeeds}</Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}