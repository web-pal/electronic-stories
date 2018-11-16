export const albums = [];

class Story {
  constructor({
    name,
    render,
  }) {
    this.name = name;
    this.render = render;
  }
}

let queueMark;

class Album {
  constructor(name, stories, index) {
    this.name = name;
    this.stories = stories || [];
    if (typeof index === 'number') {
      this.index = index;
      albums[index] = this;
    } else {
      this.index = albums.push(this) - 1;
    }

    if (queueMark) {
      window.clearTimeout(queueMark);
    }
    queueMark = window.setTimeout(window.storiesLoaded);
  }

  add(storyName, render) {
    return new Album(
      this.name,
      [
        ...this.stories,
        new Story({
          name: storyName,
          render,
        }),
      ],
      this.index,
    );
  }
}

export default function storiesOf(name) {
  return new Album(name);
}
