# Math Showdown

This is the repository for the website [Math Showdown](http://mathshowdown.com), a platform for competing against others in math contests (inspired by [Codeforces](https://codeforces.com)). Please star this repository if you like the website.

## Installation

If you are interested in running a local development environment on your computer, follow the steps below.

### Requirements

This project uses a PostgreSQL database, so make sure you have it installed. You can download PostgreSQL [here](https://www.postgresql.org/).

### Linux Installation

1. Fork and clone this repository onto your local computer.
2. Navigate to the `server` folder and run `npm install` in your terminal.
3. Navigate to the `client` folder and run `npm install` in your terminal.
4. Create a `.env` file in the `server` folder following the [env.example.txt](/server/env-example.txt) template.
5. Connect to your PostgreSQL database in your terminal and run the initialization commands found in the [init.sql](/server/config/init.sql) file.
6. Finally, run `node index.js` in the `server` folder and `npm run start` in the `client` folder, then navigate to `localhost:3000`.

## Contributing

Feel free to make a pull request and I will try to review it as quickly as possible. Also check out the Issues tab for any ideas of what to do.