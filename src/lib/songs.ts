import type { Song } from './types';

export const songs: Song[] = [
  {
    id: '1',
    title: 'Wonderwall',
    artist: 'Oasis',
    genre: 'Rock',
    chords: ['Em', 'G', 'D', 'A7sus4', 'C'],
    content: `[Intro]
[Em] [G] [D] [A7sus4] (x2)

[Verse 1]
[Em]Today is gonna be the day that they're gonna throw it back to [G]you
[Em]By now you should've somehow realized what you gotta [G]do
[Em]I don't believe that anybody feels the way I [G]do, about you [D]now [A7sus4]

[Verse 2]
[Em]Backbeat, the word was on the street that the fire in your heart is [G]out
[Em]I'm sure you've heard it all before but you never really had a [G]doubt
[Em]I don't believe that anybody feels the way I [G]do, about you [D]now [A7sus4]

[Pre-Chorus]
And [C]all the roads we [D]have to walk are [Em]winding
And [C]all the lights that [D]lead us there are [Em]blinding
[C]There are many [D]things that I would [G]like to [D]say to [Em]you
But I [D]don't know [A7sus4]how

[Chorus]
Because [C]maybe[Em], you're gonna be the [G]one that saves [Em]me
And [C]after [Em]all, you're my [G]wonder[Em]wall
`
  },
  {
    id: '2',
    title: 'Let It Be',
    artist: 'The Beatles',
    genre: 'Pop',
    chords: ['C', 'G', 'Am', 'F'],
    content: `[Intro]
[C] [G] [Am] [F]
[C] [G] [F] [C]

[Verse 1]
When I [C]find myself in [G]times of trouble,
[Am]Mother Mary [F]comes to me
[C]Speaking words of [G]wisdom, let it [F]be [C]
And [C]in my hour of [G]darkness,
she is [Am]standing right in [F]front of me
[C]Speaking words of [G]wisdom, let it [F]be [C]

[Chorus]
Let it [Am]be, let it [G]be, let it [F]be, let it [C]be
[C]Whisper words of [G]wisdom, let it [F]be [C]
`
  },
  {
    id: '3',
    title: 'Hallelujah',
    artist: 'Leonard Cohen',
    genre: 'Folk',
    chords: ['C', 'Am', 'F', 'G', 'E7'],
    content: `[Verse 1]
I've [C]heard there was a [Am]secret chord
That [C]David played and it [Am]pleased the Lord
But [F]you don't really [C]care for music, [G]do ya?
It [C]goes like this, the [F]fourth, the [G]fifth
The [Am]minor fall, the [F]major lift
The [G]baffled king com[E7]posing Halle[Am]lujah

[Chorus]
Halle[F]lujah, Halle[Am]lujah
Halle[F]lujah, Halle[C]lu-[G]jah[C]
`
  },
  {
    id: '4',
    title: 'Country Roads',
    artist: 'John Denver',
    genre: 'Country',
    chords: ['G', 'Em', 'C', 'D'],
    content: `[Intro]
[G]

[Verse 1]
[G]Almost heaven, [Em]West Virginia
[C]Blue Ridge Mountains, [G]Shenandoah [D]River
[G]Life is old there, [Em]older than the trees
[C]Younger than the mountains, [G]growin' like a [D]breeze

[Chorus]
Country [G]roads, take me [D]home
To the [Em]place I be[C]long
West Vir[G]ginia, mountain [D]momma
Take me [C]home, country [G]roads
`
  },
  {
    id: '5',
    title: "Knockin' on Heaven's Door",
    artist: 'Bob Dylan',
    genre: 'Folk Rock',
    chords: ['G', 'D', 'Am', 'C'],
    content: `[Intro]
[G] [D] [Am]
[G] [D] [C]

[Verse 1]
[G]Mama, take this [D]badge off of [Am]me
[G]I can't [D]use it any[C]more
[G]It's gettin' [D]dark, too dark to [Am]see
[G]I feel I'm knockin' on [D]heaven's [C]door

[Chorus]
[G]Knock, knock, [D]knockin' on heaven's [Am]door
[G]Knock, knock, [D]knockin' on heaven's [C]door
[G]Knock, knock, [D]knockin' on heaven's [Am]door
[G]Knock, knock, [D]knockin' on heaven's [C]door
`
  },
  {
    id: '6',
    title: 'Stand By Me',
    artist: 'Ben E. King',
    genre: 'R&B',
    chords: ['G', 'Em', 'C', 'D'],
    content: `[Intro]
[G] [Em] [C] [D] [G]

[Verse 1]
When the [G]night has come
And the [Em]land is dark
And the [C]moon is the [D]only light we'll [G]see
No, I [G]won't be afraid
Oh, I [Em]won't be afraid
Just as [C]long as you [D]stand, stand by [G]me

[Chorus]
So darlin', darlin', [G]stand by me
Oh, [Em]stand by me
Oh, [C]stand, [D]stand by me, stand by [G]me
`
  }
];

export const getAllChords = () => {
    const allChords = new Set<string>();
    songs.forEach(song => {
        song.chords.forEach(chord => allChords.add(chord));
    });
    return Array.from(allChords).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}
