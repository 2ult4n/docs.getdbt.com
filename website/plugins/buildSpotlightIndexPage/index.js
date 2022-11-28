const fs = require('fs')
const matter = require('gray-matter')

module.exports = function buildSpotlightIndexPagePlugin(context, options) {
  return {
    name: 'docusaurus-build-spotlight-index-page-plugin',
    async loadContent() {
      // Community Spotlight files directory
      const spotlightDirectory = 'docs/community/spotlight'

      // Get all Community Spotlight files and content
      const spotlightFiles = fs.readdirSync(spotlightDirectory)

      const spotlightData = spotlightFiles.reduce((arr, spotlightFile) => {
        const fileData = fs.readFileSync(
          `${spotlightDirectory}/${spotlightFile}`, 
          { encoding: 'utf8' }
        )
        if(!fileData)
          return null
        
        // convert frontmatter to json
        const fileJson = matter(fileData)
        if(!fileJson)
          return null

        arr.push(fileJson)
        return arr
      }, [])
   
      return spotlightData
    },

       
    async contentLoaded({content, actions}) {
      console.log('content', content)
      const {createData, addRoute} = actions;

        // Create json with spotlight member data
        const spotlightData = await createData(
          `spotlight-page-data.json`,
          JSON.stringify(content),
        );
        
        // Add the author routes, and ensure it receives the author's data as props
        addRoute({
          path: `/community/spotlight`,
          component: '@site/src/components/community/CommunitySpotlightList.js',
          modules: {
            // propName -> JSON file path
            spotlightData,
          },
          exact: false,
        });

    },
  };
}
