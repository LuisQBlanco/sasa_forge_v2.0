export const siteContent = {
  brand: {
    name: "SASA Forge",
    tagline: "3D Printing & Laser Fabrication",
    parent: "A division of SASA Amazing Solutions",
    serviceArea: "Toronto / GTA",
    shipping: "Canada-wide shipping + local shipping rates (carrier). No pickup.",
    quoteSla: "48 hours",
    payments: "Stripe + Interac e-Transfer",
    deposit: "40% for custom quotes; final payment before shipping",
    returns: "custom items non-refundable except defects",
  },
  global: {
    email: "sasaamazingsolutions@gmail.com",
    phone: "+1 (416) 822-5245",
    whatsapp: "https://wa.me/14168225245",
    topBarLeft: "Toronto / GTA • Canada-wide shipping",
    topBarRight: "Email us anytime • 48h quote SLA",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Get a Quote", href: "/quote" },
    { label: "Track Order", href: "/track/order" },
    { label: "Track Quote", href: "/track/quote" },
    { label: "Contact", href: "/contact" },
    { label: "Admin", href: "/admin" },
  ],
  footer: {
    about:
      "SASA Forge delivers reliable 3D printing and laser fabrication for prototypes, repairs, and small-batch production. Built for functional parts and clean finishes.",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Get a Quote", href: "/quote" },
      { label: "Track Order", href: "/track/order" },
      { label: "Contact", href: "/contact" },
      { label: "Admin", href: "/admin" },
    ],
    legal: "© {YEAR} SASA Forge — A division of SASA Amazing Solutions. All rights reserved.",
    policies: [
      { label: "Returns", href: "/policies/returns" },
      { label: "Privacy", href: "/policies/privacy" },
      { label: "Terms", href: "/policies/terms" },
    ],
  },
  home: {
    h1: "Precision Parts. Fast Turnaround.",
    emphasized: "3D Printing & Laser Fabrication",
    paragraph:
      "Custom 3D printing and laser cutting/engraving for Toronto / GTA with Canada-wide shipping. Upload a file for a quote, or shop ready-to-buy products—built for fit, function, and clean finishing.",
    badges: ["Fast Turnaround", "Multi-Material", "Laser Engraving", "4.9/5 Rating"],
    ctas: {
      primary: { label: "Shop Now", href: "/shop" },
      secondary: { label: "Get a Quote", href: "/quote" },
    },
    helper: {
      title: "Next Available",
      text: "Quote review within 48 hours",
    },
    stats: [
      { value: "5+", label: "Materials" },
      { value: "500+", label: "Parts Printed" },
      { value: "48h", label: "Quote SLA" },
    ],
    whatWeMake: {
      title: "What we make",
      intro: "Functional parts, custom gifts, and small-batch runs—made to spec.",
      cards: [
        {
          title: "Prototypes & Engineering Parts",
          text: "Fit checks, brackets, enclosures, adapters, jigs, and fixtures for real-world use.",
        },
        {
          title: "Laser Cutting & Engraving",
          text: "Clean labels, tags, plaques, and custom engraving for makers and small businesses.",
        },
        {
          title: "Home & Desk Organization",
          text: "Organizers, cable management, and practical upgrades for everyday spaces.",
        },
      ],
    },
    howItWorks: {
      title: "How it works",
      steps: [
        {
          title: "Upload",
          text: "Send STL/3MF/STEP + reference images. Tell us material and deadline.",
        },
        {
          title: "Approve & Pay",
          text: "We confirm pricing and lead time. Pay by Stripe or Interac e-Transfer. Quotes use a 40% deposit.",
        },
        {
          title: "Produce & Ship",
          text: "We print/laser, QC the result, then ship Canada-wide with tracking.",
        },
      ],
    },
    featured: {
      heading: "Popular Picks",
      subtext: "Ready-to-buy products you can customize.",
      cta: { label: "Browse Shop", href: "/shop" },
    },
    why: {
      heading: "Why SASA Forge",
      bullets: [
        "Material options for strength, flexibility, and heat resistance",
        "Clean seams and finishing options for a professional look",
        "Clear communication and tracked orders",
      ],
    },
  },
  shop: {
    title: "Shop",
    subtitle: "Ready-to-buy prints with optional customization. Canada-wide shipping.",
    filters: ["Category", "Material", "Price", "Lead Time"],
    empty: "No products found. Try clearing filters.",
  },
  product: {
    valueProps: ["Made to order", "Multiple materials", "Ships Canada-wide"],
    labels: {
      material: "Material",
      color: "Color",
      size: "Size",
      personalization: "Personalization (optional)",
    },
    buttons: {
      addToCart: "Add to Cart",
      customQuote: "Get a Quote for Custom Version",
    },
    accordion: {
      description: "Description",
      materialsCare: "Materials & Care",
      leadTimeShipping: "Lead Time & Shipping",
      materialsCareText:
        "PLA for clean detail, PETG for durability, TPU for flexibility, ASA for heat/UV resistance. Choose based on your use-case; we can recommend the best option.",
    },
  },
  cart: {
    title: "Cart",
    subtext: "Review items and proceed to checkout.",
    labels: {
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      total: "Total",
    },
    buttons: {
      checkout: "Checkout",
      continueShopping: "Continue Shopping",
    },
    shippingNote: "Shipping is carrier-based. No pickup.",
  },
  checkout: {
    title: "Checkout",
    paymentOptionsText: "Pay by Stripe for fastest processing, or choose Interac e-Transfer (manual confirmation).",
    stripeNote: "Stripe payments confirm instantly.",
    interacInstructions:
      "After placing the order, you’ll receive e-Transfer instructions. Your order begins once payment is confirmed.",
    buttons: {
      stripe: "Pay Now",
      interac: "Place Order",
    },
  },
  quote: {
    title: "Get a Quote",
    subtitle: "Upload your files and we’ll respond within 48 hours.",
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone (optional)",
      material: "Material",
      deadline: "Deadline (optional date)",
      notes: "Notes",
    },
    materials: ["PLA", "PETG", "TPU", "ASA", "Not sure"],
    uploadHelper: "Accepted: STL, 3MF, STEP, PNG, JPG • Max 100MB",
    processNote: "Custom quotes require a 40% deposit to start production. Final payment is due before shipping.",
    submit: "Submit Quote",
    success: "Quote received. We’ll review and respond within 48 hours.",
    error: "Something went wrong. Please try again or contact us.",
  },
  trackOrder: {
    title: "Track Order",
    subtitle: "Enter your order code to see the latest status.",
    inputLabel: "Order Code",
    button: "Track Order",
    labels: {
      status: "Status",
      lastUpdated: "Last Updated",
      trackingNumber: "Tracking Number",
    },
    help: "If you paid by e-Transfer, status updates after payment confirmation.",
  },
  trackQuote: {
    title: "Track Quote",
    subtitle: "Enter your quote code to see progress and payment links (if available).",
    inputLabel: "Quote Code",
    button: "Track Quote",
    labels: {
      status: "Status",
      pricedTotal: "Priced Total",
      depositDue: "Deposit Due",
      actions: "Actions",
      payDeposit: "Pay Deposit",
      payFinal: "Pay Final",
    },
    help: "Deposit links appear after your quote is priced.",
  },
  contact: {
    title: "Contact",
    subtitle: "Questions, custom jobs, or business orders—reach out anytime.",
    whatsappText: "Message us on WhatsApp",
    serviceNote: "We operate as a home-based studio—no public pickup. Shipping only.",
    cta: { label: "Get a Quote", href: "/quote" },
  },
  policies: {
    returns: [
      "Custom-made items are non-refundable except for defects.",
      "If there’s a defect, contact us within 7 days of delivery with photos.",
    ],
    privacy: ["We only use your data to process quotes/orders and provide support."],
    terms: ["Lead times vary by material and queue. Shipping timelines depend on carriers."],
  },
  admin: {
    login: {
      title: "Admin Login",
      button: "Sign In",
    },
    sidebar: ["Dashboard", "Products", "Quotes", "Orders", "Staff", "Settings"],
    emptyStates: {
      quotes: "No quotes yet.",
      orders: "No orders yet.",
    },
  },
} as const;

export type SiteContent = typeof siteContent;
