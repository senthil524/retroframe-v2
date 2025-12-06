import { Helmet } from 'react-helmet-async';

const defaultSEO = {
  siteName: 'RetroFrame',
  siteUrl: 'https://retroframe.co',
  defaultTitle: 'RetroFrame - Premium Polaroid Prints Online India',
  defaultDescription: 'Order custom polaroid prints online in India. Premium retro photo printing service with vintage effects, 8 border colors & custom captions. 18 prints starting at Rs.270. Free shipping across India.',
  defaultImage: 'https://retroframe.co/og-image.jpg',
  twitterHandle: '@retroframe',
  themeColor: '#FF6B6B'
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  structuredData,
  keywords
}) {
  const seo = {
    title: title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.defaultTitle,
    description: description || defaultSEO.defaultDescription,
    image: image || defaultSEO.defaultImage,
    url: url ? `${defaultSEO.siteUrl}${url}` : defaultSEO.siteUrl,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={defaultSEO.siteName} />
      <link rel="canonical" href={seo.url} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Theme */}
      <meta name="theme-color" content={defaultSEO.themeColor} />
      <meta name="msapplication-TileColor" content={defaultSEO.themeColor} />

      {/* Geo Tags for Local SEO (India) */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Pre-defined structured data generators
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RetroFrame",
    "url": "https://retroframe.co",
    "logo": "https://retroframe.co/logo.png",
    "description": "Premium polaroid and retro photo printing service in India",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://retroframe.co/ContactUs"
    }
  },

  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Polaroid Prints",
    "description": "Custom polaroid prints with vintage effects, 8 border colors & custom captions. Premium retro photo printing service in India.",
    "image": "https://retroframe.co/og-image.jpg",
    "brand": {
      "@type": "Brand",
      "name": "RetroFrame"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://retroframe.co/Studio",
      "priceCurrency": "INR",
      "price": "270",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "RetroFrame"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "2",
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": "3",
            "maxValue": "6",
            "unitCode": "DAY"
          }
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "20",
      "bestRating": "5",
      "worstRating": "1"
    }
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RetroFrame",
    "url": "https://retroframe.co",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://retroframe.co/OrderTracking?order_number={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RetroFrame",
    "image": "https://retroframe.co/og-image.jpg",
    "url": "https://retroframe.co",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  },

  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the minimum order for polaroid prints?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The minimum order is 18 polaroid prints, starting at Rs.270. Additional prints cost Rs.15 each."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery takes 3-6 business days across India. Shipping is free for all orders."
        }
      },
      {
        "@type": "Question",
        "name": "What customization options are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can choose from 8 border colors, 5 vintage photo effects, and add custom captions to each print."
        }
      },
      {
        "@type": "Question",
        "name": "What size are the polaroid prints?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our polaroid prints are standard polaroid size (3.5 x 4.25 inches) with the classic white border."
        }
      }
    ]
  },

  breadcrumb: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://retroframe.co${item.url}`
    }))
  })
};
