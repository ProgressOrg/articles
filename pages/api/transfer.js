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

	let webflowItems

	// Cycle through collection to get each field ID
	webflowItems = await webflow.items({
		collectionId: ids.collections.tags
	})
	const hashtags = webflowItems.items

	webflowItems = await webflow.items({
		collectionId: ids.collections.categories
	})
	const categories = webflowItems.items

	/**
	 * STEP 1: Get spreadsheet data
	 */

	const rows = 'B151:U186'
	const gapi = await fetch(
		`https://sheets.googleapis.com/v4/spreadsheets/1208NK6XyW2omFE13w6Blm-ACVqU1nxBSk577S0207Uk/values/Articles!${rows}?key=${process.env.GOOGLE_SHEETS_API}`
	)
	const response = await gapi.json()
	// console.log(response.values)

	/**
	 * STEP 2: Create new articles
	 */

	for await (let row of response.values) {
		// 0 title, 1 slug, 2 date, 3 datetime, 4 why, 5 HTML, 6 image, 7 category, 8-16 tags

		// Add hashtags
		let tags = []
		for (let i = 8; i < row.length; i++) {
			if (hashtags.some(x => x.name === row[i])) {
				tags = [...tags, hashtags.find(x => x.name === row[i])['_id']]
			}
		}

		let category = ''
		if (categories.some(x => x.name === row[7])) {
			category = categories.find(x => x.name === row[7])['_id']
		}

		const item = await webflow.createItem({
			collectionId: ids.collections.articles,
			fields: {
				_archived: false,
				_draft: false,
				author: '56b8f744075f9ea44d2f036f',
				category,
				date: row[3],
				name: row[0],
				slug: row[1].replace(/[\W]+/g, ''),
				tags,
				text: row[5],
				'why-it-matters': row[4]
			}
		})

		console.log(item)
	}

	res.json({ done: true })
}
