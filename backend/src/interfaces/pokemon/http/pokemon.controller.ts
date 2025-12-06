import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GetPokemonDetailsUseCase } from '../../../application/pokemon/use-cases/get-pokemon-details.use-case';
import { GetPokemonListUseCase } from '../../../application/pokemon/use-cases/get-pokemon-list.use-case';
import { GetPokemonMoveDetailsUseCase } from '../../../application/pokemon/use-cases/get-pokemon-move-details.use-case';
import { JwtAuthGuard } from 'src/infra/auth/jwt/jwt-auth.guard';

@ApiTags('Pokemon')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pokemon')
export class PokemonController {
  constructor(
    private readonly getPokemonDetailsUseCase: GetPokemonDetailsUseCase,
    private readonly getPokemonListUseCase: GetPokemonListUseCase,
    private readonly getPokemonMoveDetailsUseCase: GetPokemonMoveDetailsUseCase,
  ) {}

  @Get('detail/:id')
  @ApiOperation({ summary: 'Obtém os detalhes de um Pokémon específico.' })
  @ApiParam({
    name: 'id',
    description: 'ID do Pokémon para obter os detalhes',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Detalhes do Pokémon' })
  @ApiResponse({ status: 404, description: 'Pokémon não encontrado' })
  async getPokemonDetails(@Param('id') id: string) {
    return this.getPokemonDetailsUseCase.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtém uma lista de Pokémons com paginação.' })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Deslocamento de paginação',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de resultados por página',
    type: Number,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Nome do Pokémon para busca filtrada',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Pokémons com informações detalhadas',
  })
  async getPokemonList(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 20,
    @Query('name') name?: string,
  ) {
    return this.getPokemonListUseCase.execute(offset, limit, name);
  }

  @Get('moves')
  @ApiOperation({ summary: 'Obtém os detalhes de um movimento específico.' })
  @ApiQuery({
    name: 'url',
    description: 'URL do movimento para obter os detalhes',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Detalhes do movimento' })
  async getPokemonMoveDetails(@Query('url') url: string) {
    return this.getPokemonMoveDetailsUseCase.execute(url);
  }
}
