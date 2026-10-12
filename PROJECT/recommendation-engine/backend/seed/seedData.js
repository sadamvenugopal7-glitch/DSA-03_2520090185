const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.join(__dirname, '../.env') });
}

const User = require('../models/User');
const Movie = require('../models/Movie');
const Rating = require('../models/Rating');
const Favorite = require('../models/Favorite');

const sampleMovies = [
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: 8.7,
    releaseYear: 2014,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    rating: 8.8,
    releaseYear: 2010,
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Drama', 'Thriller'],
    rating: 9.0,
    releaseYear: 2008,
    imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Spider-Man: Into the Spider-Verse',
    description: 'Teen Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from parallel dimensions to stop a threat to all reality.',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: 8.4,
    releaseYear: 2018,
    imageUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    rating: 8.6,
    releaseYear: 2024,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genres: ['Drama', 'Thriller', 'Comedy'],
    rating: 8.5,
    releaseYear: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1518676599649-f0009158474f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Grand Budapest Hotel',
    description: 'A writer encounters the owner of an aging high-class hotel, who tells him of his early years serving as a lobby boy in the hotels glorious years under an exceptional concierge.',
    genres: ['Comedy', 'Drama', 'Adventure'],
    rating: 8.1,
    releaseYear: 2014,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'La La Land',
    description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    genres: ['Romance', 'Drama', 'Comedy'],
    rating: 8.0,
    releaseYear: 2016,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos actions.',
    genres: ['Action', 'Sci-Fi', 'Adventure'],
    rating: 8.4,
    releaseYear: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Spirited Away',
    description: 'During her family move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches and spirits, a world where humans are changed into beasts.',
    genres: ['Animation', 'Adventure', 'Drama'],
    rating: 8.6,
    releaseYear: 2001,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genres: ['Drama', 'Thriller', 'Action'],
    rating: 8.9,
    releaseYear: 1994,
    imageUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Matrix',
    description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    genres: ['Sci-Fi', 'Action'],
    rating: 8.7,
    releaseYear: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Shawshank Redemption',
    description: 'Over the course of several years, two convicts form a friendship, seeking solace and eventual redemption through basic compassion.',
    genres: ['Drama'],
    rating: 9.3,
    releaseYear: 1994,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Forrest Gump',
    description: 'The history of the United States from the 1950s to the 70s unfolds from the perspective of an Alabama man with an IQ of 75, who yearns to be reunited with his childhood sweetheart.',
    genres: ['Drama', 'Romance', 'Comedy'],
    rating: 8.8,
    releaseYear: 1994,
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Coco',
    description: 'Aspiring musician Miguel, confronted with his familys ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.',
    genres: ['Animation', 'Adventure', 'Comedy'],
    rating: 8.4,
    releaseYear: 2017,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Knives Out',
    description: 'A detective investigates the death of a patriarch of an eccentric, combative family.',
    genres: ['Comedy', 'Thriller', 'Drama'],
    rating: 7.9,
    releaseYear: 2019,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Blade Runner 2049',
    description: 'Young Blade Runner K discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who has been missing for thirty years.',
    genres: ['Sci-Fi', 'Thriller', 'Drama'],
    rating: 8.0,
    releaseYear: 2017,
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Superbad',
    description: 'Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.',
    genres: ['Comedy'],
    rating: 7.6,
    releaseYear: 2007,
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Fight Club',
    description: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.',
    genres: ['Drama', 'Thriller'],
    rating: 8.8,
    releaseYear: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Gladiator',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    genres: ['Action', 'Drama', 'Adventure'],
    rating: 8.5,
    releaseYear: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'About Time',
    description: 'At the age of 21, Tim discovers he can travel in time and change what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out not to be as easy as you might think.',
    genres: ['Romance', 'Drama', 'Sci-Fi'],
    rating: 7.8,
    releaseYear: 2013,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Prestige',
    description: 'After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.',
    genres: ['Drama', 'Thriller', 'Sci-Fi'],
    rating: 8.5,
    releaseYear: 2006,
    imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Your Name',
    description: 'Two teenagers share a profound, magical connection upon discovering they are swapping bodies. Things manage to become even more complicated when the boy and girl decide to meet in person.',
    genres: ['Animation', 'Romance', 'Drama'],
    rating: 8.4,
    releaseYear: 2016,
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Truman Show',
    description: 'An insurance salesman discovers his whole life is actually a reality TV show broadcast live to the world.',
    genres: ['Comedy', 'Drama', 'Sci-Fi'],
    rating: 8.2,
    releaseYear: 1998,
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Mad Max: Fury Road',
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper and a drifter named Max.',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 8.1,
    releaseYear: 2015,
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    description: 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.',
    genres: ['Romance', 'Drama', 'Sci-Fi'],
    rating: 8.3,
    releaseYear: 2004,
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Silence of the Lambs',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims.',
    genres: ['Thriller', 'Drama'],
    rating: 8.6,
    releaseYear: 1991,
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Arrival',
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    genres: ['Sci-Fi', 'Drama'],
    rating: 7.9,
    releaseYear: 2016,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  }
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recommendation_engine';
  console.log(`Connecting to MongoDB at: ${uri}`);

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connection successful.');

    // Clear previous data
    await Movie.deleteMany({});
    console.log('Cleared existing movies collection.');

    // Insert movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`Successfully seeded ${insertedMovies.length} movies into database!`);

    // Create or update demo user
    let demoUser = await User.findOne({ email: 'alex@example.com' });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'password123',
        preferredGenres: ['Sci-Fi', 'Action', 'Thriller']
      });
      console.log('Created demo user: alex@example.com / password123');
    } else {
      console.log('Demo user already exists: alex@example.com');
    }

    // Add sample rating history for demo user to demonstrate DSA preference weighting
    await Rating.deleteMany({ userId: demoUser._id });
    await Favorite.deleteMany({ userId: demoUser._id });

    // Find Inception and The Dark Knight
    const inception = insertedMovies.find(m => m.title === 'Inception');
    const darkKnight = insertedMovies.find(m => m.title === 'The Dark Knight');
    const interstellar = insertedMovies.find(m => m.title === 'Interstellar');

    if (inception && darkKnight) {
      await Rating.create([
        {
          userId: demoUser._id,
          movieId: inception._id,
          rating: 5
        },
        {
          userId: demoUser._id,
          movieId: darkKnight._id,
          rating: 5
        }
      ]);
      console.log('Seeded sample ratings for demo user (Inception: 5*, The Dark Knight: 5*).');
    }

    if (interstellar) {
      await Favorite.create({
        userId: demoUser._id,
        movieId: interstellar._id
      });
      console.log('Seeded sample favorite for demo user (Interstellar).');
    }

    console.log('Database seeding complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error during database seeding:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleMovies };
