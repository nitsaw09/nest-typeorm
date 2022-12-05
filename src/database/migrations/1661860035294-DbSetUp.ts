import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import {
  addYears,
  format,
  subYears,
  setMonth,
  setDate,
  setHours,
} from 'date-fns';

export class DbSetUp1661860035294 implements MigrationInterface {
  name = 'DbSetUp1661860035294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'menu_item',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'url', type: 'varchar' },
          { name: 'parentId', type: 'integer', isNullable: true },
          { name: 'mpath', type: 'string', isNullable: true },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'menu_item',
      new TableForeignKey({
        columnNames: ['parentId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'menu_item',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'event',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
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
        name: 'workshop',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar' },
          { name: 'eventId', type: 'integer' },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          { name: 'start', type: 'timestamp' },
          { name: 'end', type: 'timestamp' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'workshop',
      new TableForeignKey({
        columnNames: ['eventId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'event',
        onDelete: 'CASCADE',
      }),
    );

    // await queryRunner.startTransaction();

    try {
      await queryRunner.query(`INSERT INTO \`menu_item\` (\`id\`, \`name\`, \`url\`, \`parentId\`, \`createdAt\`) VALUES
          (1, 'All events', '/events', NULL, '2022-05-27 02:38:54'),
          (2, 'Laracon', '/events/laracon', 1, '2022-05-27 02:38:54'),
          (3, 'Illuminate your knowledge of the laravel code base', '/events/laracon/workshops/illuminate', 2, '2022-05-27 02:38:54'),
          (4, 'The new Eloquent - load more with less', '/events/laracon/workshops/eloquent', 2, '2022-05-27 02:38:54'),
          (5, 'Reactcon', '/events/reactcon', 1, '2022-05-27 02:38:54'),
          (6, '#NoClass pure functional programming', '/events/reactcon/workshops/noclass', 5, '2022-05-27 02:38:54'),
          (7, 'Navigating the function jungle', '/events/reactcon/workshops/jungle', 5, '2022-05-27 02:38:54')`);

      const date1 = format(subYears(new Date(), 1), 'yyyy');
      const date2 = format(addYears(new Date(), 1), 'yyyy');

      await queryRunner.query(
        `INSERT INTO \`event\` (\`id\`, \`name\`, \`createdAt\`) VALUES
          (1, 'Laravel convention ` +
          date1 +
          `', '2022-05-27 02:38:54'),
          (2, 'Laravel convention ` +
          date2 +
          `', '2022-05-27 02:38:54'),
          (3, 'React convention ` +
          date2 +
          `', '2022-05-27 02:38:54')`,
      );

      const time1 = setDate(setMonth(subYears(new Date(), 1), 1), 21);
      const time2 = addYears(new Date(), 1);
      const month21 = setMonth(time2, 9);
      const month22 = setMonth(time2, 10);
      const month23 = setMonth(time2, 8);
      const month24 = setMonth(time2, 11);

      const setHoursAndFormat = (date: Date, hours = 1) => {
        return format(setHours(date, hours), 'yyyy-mm-dd hh:mm:ss');
      };

      await queryRunner.query(
        `INSERT INTO \`workshop\` (\`id\`, \`start\`, \`end\`, \`eventId\`, \`name\`, \`createdAt\`) VALUES
          (1, '` +
          setHoursAndFormat(time1, 10) +
          `', '` +
          setHoursAndFormat(time1, 16) +
          `', 1, 'Illuminate your knowledge of the laravel code base', '2022-05-27 02:38:54'),
          (2, '` +
          setHoursAndFormat(month21, 10) +
          `', '` +
          setHoursAndFormat(month21, 16) +
          `', 2, 'The new Eloquent - load more with less', '2022-05-27 02:38:54'),
          (3, '` +
          setHoursAndFormat(month22, 10) +
          `', '` +
          setHoursAndFormat(month22, 17) +
          `', 2, 'AutoEx - handles exceptions 100% automatic', '2022-05-27 02:38:54'),
          (4, '` +
          setHoursAndFormat(month23, 10) +
          `', '` +
          setHoursAndFormat(month23, 18) +
          `', 3, '#NoClass pure functional programming', '2022-05-27 02:38:54'),
          (5, '` +
          setHoursAndFormat(month24, 9) +
          `', '` +
          setHoursAndFormat(month24, 17) +
          `', 3, 'Navigating the function jungle', '2022-05-27 02:38:54')`,
      );
    } catch (error) {
      // await queryRunner.rollbackTransaction();
      throw error;
    }

    // await queryRunner.commitTransaction();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    //empty
  }
}
