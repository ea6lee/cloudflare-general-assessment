const links = [
  {"name": "Cloudflare", "url": "https://www.cloudflare.com/en-ca/"},
  {"name": "Google", "url" : "https://www.google.com/"},
  {"name": "Facebook", "url": "https://www.facebook.com/"},
  {"name": "Click to see my Systems Engineering Submission", "url": "https://github.com/ea6lee/cloudflare-systems-assignment"}
]

const socials = [
  {"url": "https://dribbble.com/", "image" : "https://simpleicons.org/icons/dribbble.svg"},
  {"url": "https://www.twilio.com/", "image" : "https://simpleicons.org/icons/twilio.svg"},
  {"url": "https://www.airbnb.ca/", "image" : "https://simpleicons.org/icons/airbnb.svg"},
]

const host = "https://static-links-page.signalnerve.workers.dev"
const url = host + "/static/html"

const username = "Ethan Lee"
const image = "https://pbs.twimg.com/profile_images/1313131647315910666/opulcRqc_400x400.jpg"

class LinksTransformer {
  constructor(links) {
    this.links = links
  }
  
  async element(element) {
    links.forEach(elem => element.prepend(`<a href=${elem.url}>${elem.name}</a>`, { html: true }));

  }
}

class UpdateProfile {
  async element(element) {
    element.removeAttribute("style")
  }
}

class UpdateUsername {
  constructor(username) {
    this.username = username
  }

  async element(element) {
    element.setInnerContent(username)
  }
}

class UpdateImage {
  constructor(image) {
    this.image = image
  }

  async element(element) {
    element.setAttribute("src", image)
  }
}

class UpdateSocials {
  constructor(socials) {
    this.socials = socials
  }

  async element(element) {
    element.removeAttribute("style");
    socials.forEach(elem => element.prepend(`<a href=${elem.url}><img src=${elem.image}></a>`, {html:true}))
  }
}

class UpdateBody {

  async element(element) {
    element.setAttribute("class", "bg-orange-400")
  }
}

const rewriter = new HTMLRewriter()
.on("body", new UpdateBody())
.on("div#links", new LinksTransformer(links))
.on("div#profile", new UpdateProfile())
.on("img#avatar", new UpdateImage(image))
.on("h1#name", new UpdateUsername(username))
.on("div#social", new UpdateSocials(socials))
.on("title", new UpdateUsername(username))


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

/**
 * Respond with either array of links or serve HTML
 * @param {Request} request
 */
async function handleRequest(request) {
  let pathname = new URL(request.url).pathname;
  if (pathname == "/links") {
    return new Response(JSON.stringify(links), {
      headers:  {'content-type': 'application/json' },
    })
  } else {
    const init = {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    }
    const response = await fetch(url, init)
    return rewriter.transform(response)
  }
  
}


