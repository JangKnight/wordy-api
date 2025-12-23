#  What is EJS?
Embedded JavaScript – simple templating language that lets you generate HTML markup with plain JavaScript using `.ejs`files.

#  Setting up EJS with Express
1. Install EJS via npm:
   ```bash
   npm install ejs
   ```
2. Set EJS as the view engine in your Express app:
   ```javascript
   app.set('view engine', 'ejs');
   app.set('views', path.join(__dirname, 'views'));
   ```
3. Create a `views` directory in your project root to store your EJS templates.
4. Render EJS templates in your routes:
   ```javascript
   app.get('/', (req, res) => {
       res.render('index', { data: yourData });
   });
   ```

   ```javascript
   res.render('index', { today: getToday() });
   ```