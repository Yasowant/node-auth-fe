import { FAQS } from "../../data/jobs";

const Faq = () => (
  <div className="faq">
    {FAQS.map((item) => (
      <details className="faq-item" key={item.q}>
        <summary>{item.q}</summary>
        <p>{item.a}</p>
      </details>
    ))}
  </div>
);

export default Faq;
