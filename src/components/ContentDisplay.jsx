import PropTypes from "prop-types";
import "../App.css";
const ContentDisplay = ({ htmlString }) => {
  //   Use a regular expression to find the oembed element in the HTML string
  const oembedRegex = /<oembed[^>]*>/g;
  const oembedMatches = htmlString.match(oembedRegex);

  // convert oembed to iframe (youtube video)
  if (oembedMatches) {
    oembedMatches.forEach((oembedMatch) => {
      const oembedUrl = oembedMatch.match(/url="([^"]*)"/)[1];
      let rightUrl = oembedUrl.replace("youtu.be", "youtube.com/embed");
      const iframeElement = `<iframe width="100%" height="370px"  src="${rightUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      htmlString = htmlString.replace(oembedMatch, iframeElement);
    });
  }

  return <div className="break-all" dangerouslySetInnerHTML={{ __html: htmlString }} />;
};
ContentDisplay.propTypes = {
  htmlString: PropTypes.string.isRequired,
};
export default ContentDisplay;
