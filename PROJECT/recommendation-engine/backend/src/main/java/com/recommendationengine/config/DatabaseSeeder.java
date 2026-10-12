package com.recommendationengine.config;

import com.recommendationengine.model.Favorite;
import com.recommendationengine.model.Movie;
import com.recommendationengine.model.Rating;
import com.recommendationengine.model.User;
import com.recommendationengine.repository.FavoriteRepository;
import com.recommendationengine.repository.MovieRepository;
import com.recommendationengine.repository.RatingRepository;
import com.recommendationengine.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Automatically seeds the database on startup if movies catalog is empty.
 * Populates 28 popular movies across all 8 genres, demo user, ratings, and favorites.
 */
@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private FavoriteRepository favoriteRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        try {
            long movieCount = movieRepository.count();
            if (movieCount == 0) {
                System.out.println("🎬 Catalog is empty. Seeding initial 28 sample movies into MongoDB...");
                seedMovies();
            } else {
                System.out.println("🎬 Found " + movieCount + " movies in MongoDB catalog.");
            }

            // Ensure demo user exists
            seedDemoUser();
        } catch (Exception e) {
            System.err.println("⚠️ Notice during database seeding: " + e.getMessage());
        }
    }

    private void seedMovies() {
        List<Movie> movies = new ArrayList<>();

        movies.add(new Movie(
                "Interstellar",
                "When Earth becomes uninhabitable, a team of researchers and an ex-NASA pilot travel through a wormhole in search of a new home.",
                new ArrayList<>(Arrays.asList("Sci-Fi", "Drama", "Adventure")),
                8.7, 2014,
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Inception",
                "A skilled thief steals corporate secrets through dream-sharing technology and is tasked with planting an idea into a CEO's subconscious.",
                new ArrayList<>(Arrays.asList("Sci-Fi", "Action", "Thriller")),
                8.8, 2010,
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Dark Knight",
                "When the Joker wreaks havoc and chaos on Gotham, Batman must accept psychological tests of his ability to fight injustice.",
                new ArrayList<>(Arrays.asList("Action", "Drama", "Thriller")),
                9.0, 2008,
                "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Spider-Man: Into the Spider-Verse",
                "Teen Miles Morales becomes the new Spider-Man and joins other Spider-Heroes from parallel dimensions to stop a threat to all reality.",
                new ArrayList<>(Arrays.asList("Animation", "Action", "Adventure")),
                8.4, 2018,
                "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Dune: Part Two",
                "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                new ArrayList<>(Arrays.asList("Sci-Fi", "Adventure", "Action")),
                8.6, 2024,
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Parasite",
                "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
                new ArrayList<>(Arrays.asList("Drama", "Thriller", "Comedy")),
                8.5, 2019,
                "https://images.unsplash.com/photo-1518676599649-f0009158474f?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Grand Budapest Hotel",
                "A writer encounters the owner of an aging high-class hotel, recounting adventures under an exceptional concierge.",
                new ArrayList<>(Arrays.asList("Comedy", "Drama", "Adventure")),
                8.1, 2014,
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "La La Land",
                "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
                new ArrayList<>(Arrays.asList("Romance", "Drama", "Comedy")),
                8.0, 2016,
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Avengers: Endgame",
                "After the devastating events of Infinity War, the universe is in ruins. The remaining Avengers assemble to reverse Thanos's actions.",
                new ArrayList<>(Arrays.asList("Action", "Sci-Fi", "Adventure")),
                8.4, 2019,
                "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Spirited Away",
                "A sullen 10-year-old girl wanders into a world ruled by gods, spirits, and supernatural beings.",
                new ArrayList<>(Arrays.asList("Animation", "Adventure", "Drama")),
                8.6, 2001,
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Pulp Fiction",
                "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
                new ArrayList<>(Arrays.asList("Drama", "Thriller", "Action")),
                8.9, 1994,
                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Matrix",
                "A computer programmer discovers reality is an elaborate cybernetic simulation created by sentient machines.",
                new ArrayList<>(Arrays.asList("Sci-Fi", "Action")),
                8.7, 1999,
                "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Shawshank Redemption",
                "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                new ArrayList<>(Arrays.asList("Drama")),
                9.3, 1994,
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Forrest Gump",
                "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold through the eyes of an Alabama man.",
                new ArrayList<>(Arrays.asList("Drama", "Romance", "Comedy")),
                8.8, 1994,
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Coco",
                "Aspiring musician Miguel enters the Land of the Dead to discover his family's ancestral history.",
                new ArrayList<>(Arrays.asList("Animation", "Adventure", "Comedy")),
                8.4, 2017,
                "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Knives Out",
                "A master detective investigates the mysterious death of an eccentric wealthy novelist amidst a combative family.",
                new ArrayList<>(Arrays.asList("Comedy", "Thriller", "Drama")),
                7.9, 2019,
                "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Blade Runner 2049",
                "A young blade runner uncovers a long-buried secret that leads him to former blade runner Rick Deckard.",
                new ArrayList<>(Arrays.asList("Sci-Fi", "Thriller", "Drama")),
                8.0, 2017,
                "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Superbad",
                "Two high school friends go through hilarious misadventures attempting to secure alcohol for a party.",
                new ArrayList<>(Arrays.asList("Comedy")),
                7.6, 2007,
                "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Fight Club",
                "An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker.",
                new ArrayList<>(Arrays.asList("Drama", "Thriller")),
                8.8, 1999,
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Gladiator",
                "A former Roman general sets out to exact vengeance against the corrupt emperor who murdered his family.",
                new ArrayList<>(Arrays.asList("Action", "Drama", "Adventure")),
                8.5, 2000,
                "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "About Time",
                "At the age of 21, Tim discovers he can travel in time and attempts to make his world a better place by finding love.",
                new ArrayList<>(Arrays.asList("Romance", "Drama", "Sci-Fi")),
                7.8, 2013,
                "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Prestige",
                "Two stage magicians in 1890s London engage in a competitive battle to create the ultimate teleportation illusion.",
                new ArrayList<>(Arrays.asList("Drama", "Thriller", "Sci-Fi")),
                8.5, 2006,
                "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Your Name",
                "Two teenagers share a profound, magical connection upon discovering they are swapping bodies across space and time.",
                new ArrayList<>(Arrays.asList("Animation", "Romance", "Drama")),
                8.4, 2016,
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Truman Show",
                "An insurance salesman discovers his entire life is actually a reality television show broadcast live to the globe.",
                new ArrayList<>(Arrays.asList("Comedy", "Drama", "Sci-Fi")),
                8.2, 1998,
                "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Mad Max: Fury Road",
                "In a post-apocalyptic wasteland, a rebel warrior leads a group of female prisoners against a tyrannical warlord.",
                new ArrayList<>(Arrays.asList("Action", "Adventure", "Sci-Fi")),
                8.1, 2015,
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Eternal Sunshine of the Spotless Mind",
                "A couple undergoes a medical procedure to erase each other from their memories after a bitter breakup.",
                new ArrayList<>(Arrays.asList("Romance", "Drama", "Sci-Fi")),
                8.3, 2004,
                "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "The Silence of the Lambs",
                "A young FBI cadet seeks the advice of an incarcerated cannibalistic psychiatrist to catch an active serial killer.",
                new ArrayList<>(Arrays.asList("Thriller", "Drama")),
                8.6, 1991,
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80"
        ));

        movies.add(new Movie(
                "Arrival",
                "A linguist works with the military to decipher alien communications after mysterious spacecraft touch down across Earth.",
                new ArrayList<>(Arrays.asList("Sci-Fi", "Drama")),
                7.9, 2016,
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
        ));

        movieRepository.saveAll(movies);
        System.out.println("✅ Seeded 28 sample movies into MongoDB catalog successfully.");
    }

    private void seedDemoUser() {
        if (!userRepository.existsByEmail("alex@example.com")) {
            User demoUser = new User(
                    "Alex Johnson",
                    "alex@example.com",
                    passwordEncoder.encode("password123"),
                    new ArrayList<>(Arrays.asList("Sci-Fi", "Action", "Thriller"))
            );
            demoUser = userRepository.save(demoUser);

            // Add sample ratings and favorite for demo user
            List<Movie> allMovies = movieRepository.findAll();
            Movie inception = allMovies.stream().filter(m -> m.getTitle().equals("Inception")).findFirst().orElse(null);
            Movie darkKnight = allMovies.stream().filter(m -> m.getTitle().equals("The Dark Knight")).findFirst().orElse(null);
            Movie interstellar = allMovies.stream().filter(m -> m.getTitle().equals("Interstellar")).findFirst().orElse(null);

            if (inception != null) {
                ratingRepository.save(new Rating(demoUser.getId(), inception.getId(), 5));
            }
            if (darkKnight != null) {
                ratingRepository.save(new Rating(demoUser.getId(), darkKnight.getId(), 5));
            }
            if (interstellar != null) {
                favoriteRepository.save(new Favorite(demoUser.getId(), interstellar.getId()));
            }

            System.out.println("✅ Seeded demo user: alex@example.com / password123 with sample ratings and favorites.");
        }
    }
}
