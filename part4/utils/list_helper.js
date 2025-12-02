const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((accum, item) => accum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce(
        (curr_max, item) => {
            if (!item) return curr_max
            if (!curr_max) return item
            return curr_max.likes > item.likes ? curr_max : item
        },
        null
    )
}

const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    let authorDict = {}

    for (const blog of blogs) {
        if (!authorDict[blog.author]) {
            authorDict[blog.author] = 1
        }
        else {
            authorDict[blog.author]++
        }
    }

    currMax = 0
    authorMax = null
    for (let author in authorDict) {
        if (authorDict[author] > currMax) {
            authorMax = author
            currMax = authorDict[author]
        }
    }

    return {
        author: authorMax,
        blogs: currMax
    }
}

const mostLikes = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }

    let authorDict = {}

    for (const blog of blogs) {
        if (!authorDict[blog.author]) {
            authorDict[blog.author] = blog.likes
        }
        else {
            authorDict[blog.author] += blog.likes
        }
    }

    currMax = 0
    authorMax = null
    for (let author in authorDict) {
        if (authorDict[author] > currMax) {
            authorMax = author
            currMax = authorDict[author]
        }
    }

    return {
        author: authorMax,
        likes: currMax
    }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}