import React from 'react';
import classNames from 'classnames/bind';
import { useQuery, gql } from '@apollo/client';
import { Heading } from '../../components';
import styles from './Hero.module.scss';

let cx = classNames.bind(styles);

const HERO_QUERY = gql`
  query GetHeroSection($id: ID!, $idType: PageIdType!) {
    page(id: $id, idType: $idType) {
      heroSection {
        heroBgType
        heroBgVideo
        heroCtaType
        heroSubtitle
        heroTitle
        heroBgImage {
          node {
            altText
            title
            sourceUrl
          }
        }
        heroCtaPrimary {
          title
          url
        }
        heroCtaSecondary {
          url
          title
        }
      }
    }
  }
`;

export default function Hero({ pageId, pageIdType = 'URI', className, children }) {
  const { data, loading, error } = useQuery(HERO_QUERY, {
    variables: { id: pageId, idType: pageIdType },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading hero section</p>;

  const heroSection = data?.page?.heroSection;

  return (
    <div className={cx('component', className, {
      'no-media': heroSection?.heroBgType === 'none',
    })}>
      {heroSection?.heroBgType !== 'none' && (
        <div className={cx('media')}>
          {heroSection?.heroBgType === 'image' && (
            <img src={heroSection.heroBgImage?.node?.sourceUrl} alt={heroSection.heroBgImage?.node?.altText} />
          )}
          {heroSection?.heroBgType === 'video' && (
            <video src={heroSection.heroBgVideo} autoPlay muted loop />
          )}
        </div>
      )}
      <div className={cx('content')}>
        <Heading level="h1">
          <span className={cx('title')}>{heroSection?.heroTitle}</span>
        </Heading>
        {heroSection?.heroSubtitle && (
          <Heading level="h2">
            <span className={cx('subtitle')}>{heroSection.heroSubtitle}</span>
          </Heading>
        )}
        <div className={cx('cta-wrapper')}>
          {heroSection?.heroCtaPrimary && (
            <a href={heroSection.heroCtaPrimary.url} className={cx('cta', 'primary')}>
              {heroSection.heroCtaPrimary.title}
            </a>
          )}
          {heroSection?.heroCtaType === 'two' && heroSection?.heroCtaSecondary && (
            <a href={heroSection.heroCtaSecondary.url} className={cx('cta', 'secondary')}>
              {heroSection.heroCtaSecondary.title}
            </a>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
