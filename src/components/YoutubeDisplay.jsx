import PropTypes from "prop-types";

// use to display the content of the blog post and process of produce of the product

const YoutubeDisplay = ({ url }) => {
  //   Use a regular expression to find the oembed element in the HTML string

  let rightUrl = url.replace("youtu.be", "youtube.com/embed");
  const iframeElement = `<iframe width="100%" height="200px"  src="${rightUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  return (
    <div
      className="break-all"
      dangerouslySetInnerHTML={{ __html: iframeElement }}
    />
  );
};
YoutubeDisplay.propTypes = {
  url: PropTypes.string.isRequired,
};
export default YoutubeDisplay;
