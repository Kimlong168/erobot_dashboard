const ContentDisplay = ({ htmlString }) => {
  //   Use a regular expression to find the oembed element in the HTML string
  const oembedRegex = /<oembed[^>]*>/g;
  const oembedMatches = htmlString?.match(oembedRegex);

  // convert oembed to iframe (youtube video)
  if (oembedMatches) {
    oembedMatches.forEach((oembedMatch) => {
      const oembedUrl = oembedMatch.match(/url="([^"]*)"/)[1];
      let rightUrl = oembedUrl.replace("youtu.be", "youtube.com/embed");
      const iframeElement = `<iframe width="100%" height="370px"  src="${rightUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      htmlString = htmlString.replace(oembedMatch, iframeElement);
    });
  }

  return (
    <div className="prose-pre:w-[100%] text-gray-2 prose prose-h1:mt-7 prose-h2:mt-6 prose-h3:mt-4 prose-h4:mt-3 prose-p:m-0 prose-p:mt-2 prose-a:text-blue-500 prose-a:cursor-pointer max-w-full text-justify">
      <div dangerouslySetInnerHTML={{ __html: htmlString }} />
    </div>
  );
};
export default ContentDisplay;
