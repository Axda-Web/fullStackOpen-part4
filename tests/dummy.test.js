const listHelper = require('../utils/list_helper')

describe('Dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('Total likes', () => {

  test('When there is no blog, it returns 0', () => {

    const blogs = []

    const expectedValue = 0
    const actualValue = listHelper.totalLikes(blogs)

    expect(actualValue).toBe(expectedValue)
  })

  test('When there is only one blog, it returns the likes value of that blog', () => {

    const blogs = [{
      id: '6411842ccf87d385d5125a52',
      title: 'The best programming language',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/1',
      likes: 13
    }]

    const expectedValue = 13
    const actualValue = listHelper.totalLikes(blogs)

    expect(actualValue).toBe(expectedValue)
  })

  test('When there is multiple blog, it returns the total number of likes', () => {

    const blogs = [{
      id: '6411842ccf87d385d5125a52',
      title: 'The best programming language',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/1',
      likes: 13
    }, {
      id: '6412178869fca96ebf51730d',
      title: 'How to become FE Developer',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/2',
      likes: 77
    }, {
      id: '6412204a22b5a450c7b30756',
      title: 'Master Rege',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/3',
      likes: 6
    }]

    const expectedValue = 96
    const actualValue = listHelper.totalLikes(blogs)

    expect(actualValue).toBe(expectedValue)
  })
})

describe('Favorite blog', () => {

  test('When there is no blog, it returns 0', () => {

    const blogs = []

    const expectedValue = 'There is no blog yet'
    const actualValue = listHelper.favoriteBlog(blogs)

    expect(actualValue).toBe(expectedValue)
  })

  test('When there is only one blog, it returns that blog values', () => {

    const blogs = [{
      id: '6411842ccf87d385d5125a52',
      title: 'The best programming language',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/1',
      likes: 13
    }]

    const expectedValue = {
      title: 'The best programming language',
      author: 'Axda',
      likes: 13
    }
    const actualValue = listHelper.favoriteBlog(blogs)

    expect(actualValue).toEqual(expectedValue)
  })

  test('When there is multiple blog, it returns the values of the blog with the most likes', () => {

    const blogs = [{
      id: '6411842ccf87d385d5125a52',
      title: 'The best programming language',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/1',
      likes: 13
    }, {
      id: '6412178869fca96ebf51730d',
      title: 'How to become FE Developer',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/2',
      likes: 77
    }, {
      id: '6412204a22b5a450c7b30756',
      title: 'Master Rege',
      author: 'Axda',
      url: 'http://localhost:3003/api/blogs/3',
      likes: 6
    }]

    const expectedValue = {
      title: 'How to become FE Developer',
      author: 'Axda',
      likes: 77
    }
    const actualValue = listHelper.favoriteBlog(blogs)

    expect(actualValue).toEqual(expectedValue)
  })
})