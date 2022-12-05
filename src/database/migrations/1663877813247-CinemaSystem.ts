import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    try {
      await queryRunner.createTable(
        new Table({
          name: 'cities',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'string' },
            { name: 'state', type: 'string' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'theaters',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'string' },
            { name: 'cityId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'theaters',
        new TableForeignKey({
          columnNames: ['cityId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'cities',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'theater-screens',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'string' },
            { name: 'theaterId', type: 'integer' },
            { name: 'type', type: 'enum', enum: ['2D', '3D'] },
            { name: 'maxSeats', type: 'integer' },
            { name: 'row', type: 'integer' },
            { name: 'columns', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'theater-screens',
        new TableForeignKey({
          columnNames: ['theaterId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'theaters',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'seat-types',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            {
              name: 'theaterId', 
              type: 'integer',
            },
            { name: 'type', type: 'enum', enum: ['vip', 'couple', 'general'] },
            {
              name: 'premium',
              type: 'integer',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'screen-seats',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'screenId', type: 'integer' },
            { name: 'seatNumber', type: 'integer' },
            { name: 'typeId', type: 'integer' },
            {
              name: 'row',
              type: 'enum',
              enum: ['1', '2', '3', '4', '5'],
            },
            {
              name: 'column',
              type: 'enum',
              enum: ['1', '2', '3', '4', '5'],
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'screen-seats',
        new TableForeignKey({
          columnNames: ['screenId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'seat-types',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'screen-seats',
        new TableForeignKey({
          columnNames: ['screenId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'theater-screens',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'films',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'varchar' },
            { name: 'type', type: 'varchar' },
            { name: 'duration', type: 'string', isNullable: true },
            { name: 'releaseDate', type: 'timestamp', isNullable: true },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'film-schedules',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'screenId', type: 'integer' },
            { name: 'filmId', type: 'integer' },
            {
              name: 'price',
              type: 'integer',
            },
            {
              name: 'time',
              type: 'timestamp',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'film-schedules',
        new TableForeignKey({
          columnNames: ['filmId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'films',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'film-schedules',
        new TableForeignKey({
          columnNames: ['screenId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'theater-screens',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'film-booking',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'scheduleId', type: 'integer' },
            { name: 'seatId', type: 'integer' },
            {
              name: 'ticketNumber',
              type: 'string',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'film-booking',
        new TableForeignKey({
          columnNames: ['scheduleId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'film-schedules',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createForeignKey(
        'film-booking',
        new TableForeignKey({
          columnNames: ['seatId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'screen-seats',
          onDelete: 'CASCADE',
        }),
      );

      await queryRunner.createTable(
        new Table({
          name: 'film-reviews',
          columns: [
            {
              name: 'id',
              type: 'integer',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'filmId', type: 'integer' },
            {
              name: 'rating',
              type: 'integer',
            },
            {
              name: 'comments',
              type: 'string',
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );

      await queryRunner.createForeignKey(
        'film-reviews',
        new TableForeignKey({
          columnNames: ['filmId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'films',
          onDelete: 'CASCADE',
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
