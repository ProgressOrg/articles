import Webflow from 'webflow-api'

export default async (req, res) => {
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
	const articleItems = await webflow.items({
		collectionId: ids.collections.articles
	})
	// articleItems.items.forEach(x => console.log(x['_id'], x['name']))

	// Cycle through collection to get each item ID
	const tagItems = await webflow.items({ collectionId: ids.collections.tags })
	// tagItems.items.forEach(x => console.log(x['_id'], x['name']))

	const sheet = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/1208NK6XyW2omFE13w6Blm-ACVqU1nxBSk577S0207Uk?key=${process.env.GOOGLE_SHEETS_API}`
	)
	const response = await sheet.json()

	console.log(response)

	res.json({ done: true })
}
