import { useQuery, gql } from '@apollo/client';
import React from 'react';
import styles from './ClientShowcase.module.scss';

const CLIENT_LOGO_CAROUSEL_QUERY = gql`
  query GetClientLogoCarousel($id: ID!, $idType: PageIdType!) {
    page(id: $id, idType: $idType) {
      id
      clientLogoCarousel {
      clientLogoImage {
        logo {
          node {
            altText
            title
            sourceUrl
          }
        }
      }
    }
    }
  }
`;

export default function ClientShowcase({ pageId, pageIdType = 'URI' }) {
  const { data, loading, error } = useQuery(CLIENT_LOGO_CAROUSEL_QUERY, {
    variables: { id: pageId, idType: pageIdType },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading client logos</p>;

  const clientLogos = data?.page?.clientLogoCarousel?.clientLogoImage ?? [];
  console.log(clientLogos);

  return (
    <div className={styles.carousel}>
      {clientLogos.map((logo, index) => (
        <div key={index} className={styles.logo}>
          <img src={logo.logo.node.sourceUrl} alt={`Client Logo ${index + 1}`} />
        </div>
      ))}
    </div>
  );
}
