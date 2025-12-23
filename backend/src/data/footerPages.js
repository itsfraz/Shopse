const initialFooterPages = [
    {
        title: "Track Your Order",
        slug: "track-order",
        sections: [
            {
                heading: "Where is my order?",
                content: "Enter your Order ID and Email/Phone Number to see the real-time status of your shipment. You can find your Order ID in the confirmation email we sent you."
            }
        ],
        type: "track-order",
        seo: {
            metaTitle: "Track Your Order | Status & Delivery Updates",
            metaDescription: "Check the current status of your order with your Order ID."
        }
    },
    {
        title: "Warranty & Support",
        slug: "warranty-support",
        sections: [
            {
                heading: "Warranty Policies",
                content: "All our products come with a standard manufacturer's warranty. The duration varies by product category:\n\n* **Headphones:** 1 Year\n* **Speakers:** 1 Year\n* **Cables:** 6 Months"
            },
            {
                heading: "Claim Process",
                content: "To claim warranty, please register your product on our site and contact our support team with your proof of purchase. We provide doorstep pickup for warranty claims in select cities."
            },
            {
                heading: "Contact Support",
                content: "Email: support@example.com\nPhone: 1800-123-4567 (Mon-Sat, 9AM-7PM)"
            }
        ],
        type: "standard", 
        seo: {
            metaTitle: "Warranty & Support | Product Help",
            metaDescription: "Learn about our warranty policies and how to get support for your products."
        }
    },
    {
        title: "Return Policy",
        slug: "return-policy",
        sections: [
            {
                heading: "Easy Returns",
                content: "We offer a 7-day easy return policy for products that are damaged, defective, or not as described."
            },
            {
                heading: "Return Eligibility",
                content: "* Product must be unused and in original packaging.\n* All accessories and manual must be included.\n* Damage must be reported within 24 hours of delivery."
            },
            {
                heading: "Refund Process",
                content: "Once we verify the return, the refund will be processed to your original payment method within 5-7 business days."
            }
        ],
        type: "standard",
        seo: {
            metaTitle: "Return Policy | Easy Returns & Refunds",
            metaDescription: "Understand our return process, eligibility, and refund timelines."
        }
    },
    {
        title: "Service Centers",
        slug: "service-centers",
        sections: [
            {
                heading: "Locate a Service Center",
                content: "We have over 100 service centers across the country to assist you."
            },
             {
                heading: "Mumbai",
                content: "**Andheri West:** 123, Tech Plaza, Link Road, Mumbai - 400053.\n**Dadar:** Shop 4, Station Road, Dadar West, Mumbai - 400028."
            },
             {
                heading: "Delhi",
                content: "**Nehru Place:** 55, Computing Hub, Nehru Place, New Delhi - 110019.\n**Connaught Place:** 12, Inner Circle, New Delhi - 110001."
            }
        ],
        type: "service-centers",
        seo: {
            metaTitle: "Service Centers | Find Support Near You",
            metaDescription: "Find the nearest service center for quick repairs and support."
        }
    },
    {
        title: "Bulk Orders",
        slug: "bulk-orders",
        sections: [
            {
                heading: "Corporate Gifts & Bulk Purchases",
                content: "Looking to buy in bulk for your team or event? We offer special pricing and customization options for bulk orders."
            },
            {
                heading: "Why Choose Us?",
                content: "* Exclusive Discounts\n* GST Invoicing\n* Fast & Priority Shipping\n* Custom Branding Options"
            }
        ],
        type: "bulk-orders",
        seo: {
            metaTitle: "Bulk Orders | Corporate Gifting",
            metaDescription: "Get exclusive quotes for corporate gifting and bulk purchases."
        }
    },
    {
        title: "FAQs",
        slug: "faqs",
        sections: [
            {
                heading: "Orders & Shipping",
                content: "**Q: How long does delivery take?**\nA: Usually 3-5 business days.\n\n**Q: Can I change my delivery address?**\nA: Yes, before the order is shipped."
            },
             {
                heading: "Payments",
                content: "**Q: What payment methods do you accept?**\nA: Credit/Debit Cards, UPI, Net Banking, and COD.\n\n**Q: Is it safe to use my card?**\nA: Yes, we use 100% secure encrypted payment gateways."
            },
             {
                heading: "Returns",
                content: "**Q: Do you offer free returns?**\nA: Yes, if the product is defective."
            }
        ],
        type: "faqs",
        seo: {
            metaTitle: "FAQs | Frequently Asked Questions",
            metaDescription: "Find answers to common questions about orders, payments, and products."
        }
    },
    {
        title: "Why Buy Direct",
        slug: "why-buy-direct",
        sections: [
             {
                heading: "Authenticity Guaranteed",
                content: "When you buy from our official store, you are guaranteed 100% authentic products directly from the brand."
            },
            {
                heading: "Best Deals & Offers",
                content: "Get access to exclusive launches, flash sales, and bundle offers not available anywhere else."
            },
            {
                heading: "Extended Warranty",
                content: "Register your product instantly and enjoy seamless warranty support."
            }
        ],
        type: "standard",
        seo: {
            metaTitle: "Why Buy Direct | Benefits",
            metaDescription: "Discover the advantages of buying directly from our official online store."
        }
    }
];

module.exports = initialFooterPages;
