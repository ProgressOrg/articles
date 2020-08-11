import Webflow from 'webflow-api'

export default (req, res) => {
	const webflow = new Webflow({ token: process.env.WEBFLOW_API })

	const ids = {
		site: '56b26b90d28b886833e7a042',
		collections: {
			articles: '56b2bbecbdb30c907c8f6353',
			authors: '56b26b90d28b886833e7a056',
			categories: '56b26b90d28b886833e7a058',
			tags: '56b8fce9075f9ea44d2f0f55'
		}
	}

	// Cycle through collection to get each field ID
	const items = webflow.items({ collectionId: ids.collections.articles })
	items.then(i => console.log(i.items[0]))

	// Cycle through collection to get each item ID
	const items = webflow.items({ collectionId: ids.collections.tags })
	items.then(i => {
		i.items.forEach(item => console.log(item['_id'], item['name']))
	})

	res.json({ done: true })
}
