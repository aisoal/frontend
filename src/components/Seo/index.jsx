import { Helmet } from "react-helmet-async";

export default function Seo({ title, description, image, url }) {
  return (
    <Helmet>
      <title>{title ? `${title} | React Starter` : `React Starter`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
    </Helmet>
  );
}
