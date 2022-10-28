import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'discord.js';
import { Movie } from 'src/lib/tmdb/dto/movie.dto';
import { Repository } from 'typeorm';
import { SuggestionEntity } from './entity/suggestion.entity';

@Injectable()
export class SuggestionService {
  constructor(
    @InjectRepository(SuggestionEntity)
    private suggestionsRepository: Repository<SuggestionEntity>,
  ) {}

  async clear() {
    await this.suggestionsRepository.clear();
  }

  async getMovieIds() {
    const movieIds: number[] = [];

    const suggestions = await this.suggestionsRepository.find({
      select: ['movieId'],
    });

    suggestions.forEach((suggestion) => {
      if (!movieIds.includes(suggestion.movieId)) {
        movieIds.push(suggestion.movieId);
      }
    });

    return movieIds;
  }

  async count() {
    return (await this.getMovieIds()).length;
  }

  async findByMovieId(movieId: number) {
    return this.suggestionsRepository.findOneBy({ movieId });
  }

  async update(user: User, movie: Movie) {
    if (process.env.MOVIEBOT_MULTIPLE_SUGGESTIONS != 'true') {
      await this.suggestionsRepository.delete({
        userId: user.id,
      });
    } else {
      const found = await this.suggestionsRepository.findOneBy({
        userId: user.id,
        movieId: movie.id,
      });

      if (found) return;
    }

    this.suggestionsRepository.save({
      userId: user.id,
      movieId: movie.id,
    });
  }
}
