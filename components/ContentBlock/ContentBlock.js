import { useQuery, gql } from '@apollo/client';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './ContentBlock.module.scss';

let cx = classNames.bind(styles);

const CONTENT_BLOCK_QUERY = gql`
  query GetContentBlock($id: ID!, $idType: PageIdType!) {
    page(id: $id, idType: $idType) {
      contentBlock {
        contentAlignment
        contentType
        contentMedia {
          node {
            sourceUrl
            altText
          }
        }
        contentVideo
        contentTitle
        contentText
        contentCta {
          url
          title
          target
        }
      }
    }
  }
`;

export default function ContentBlock({ pageId, pageIdType = 'URI' }) {
  const { data, loading, error } = useQuery(CONTENT_BLOCK_QUERY, {
    variables: { id: pageId, idType: pageIdType },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading content block</p>;

  const contentBlock = data?.page?.contentBlock;

  return (
    <div className={cx('component', { 'no-media': contentBlock?.contentType === 'text' })} data-align={contentBlock?.contentAlignment}>
      <div className={cx('content')}>
        {contentBlock?.contentTitle && <h2>{contentBlock.contentTitle}</h2>}
        {contentBlock?.contentText && <p>{contentBlock.contentText}</p>}
        {contentBlock?.contentCta && (
          <a href={contentBlock.contentCta.url} target={contentBlock.contentCta.target} className={cx('cta')}>
            {contentBlock.contentCta.title}
          </a>
        )}
      </div>
      {contentBlock?.contentType === 'image' && contentBlock?.contentMedia && (
        <div className={cx('media')}>
          <img src={contentBlock.contentMedia.node.sourceUrl} alt={contentBlock.contentMedia.node.altText} />
        </div>
      )}
      {contentBlock?.contentType === 'video' && contentBlock?.contentVideo && (
        <div className={cx('media')}>
          <video src={contentBlock.contentVideo} controls></video>
        </div>
      )}
    </div>
  );
}
