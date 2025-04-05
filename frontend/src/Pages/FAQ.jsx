import React, { useState } from 'react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { question: "What is HayakuID?", answer: "HayakuID is a digital identity management system designed to modernize the passport and national ID application process in Lesotho." },
        { question: "How do I apply for an ID or passport?", answer: "You can apply online through the HayakuID portal by submitting your personal details and required documents." },
        { question: "Is my data secure with HayakuID?", answer: "Yes, we use advanced encryption and biometric authentication to ensure the highest level of security for your personal information." },
        { question: "Can I update my details after submission?", answer: "Yes, you can update certain details like your address and contact information before final processing." },
        { question: "How long does it take to process an application?", answer: "Processing times vary, but you can track your application status in real-time through the HayakuID dashboard." }
    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <ul className="faq-list">
                {faqs.map((faq, index) => (
                    <li key={index} className="faq-item">
                        <button
                            className="faq-question"
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`answer-${index}`}
                        >
                            {faq.question}
                        </button>
                        {openIndex === index && (
                            <p id={`answer-${index}`} className="faq-answer">
                                {faq.answer}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default FAQ;