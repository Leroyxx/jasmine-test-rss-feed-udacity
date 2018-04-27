/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */
/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('have a defined url', function() {
            for (const feed of allFeeds) {
                expect(feed.url).toBeTruthy();
                expect(feed.url.length).not.toBe('');
            }
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('have a defined name', function() {
            for (const feed of allFeeds) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe('');
            }
        })
    });


    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {
        beforeEach(function() {
            //Is the menu open when the page loads?
            this.defaultMenuState = $('body').hasClass('menu-hidden');
        });
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden by default', function() {
            expect(this.defaultMenuState).toBe(true);
        });
        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('changes visibility on click', function() {
            //Use jQuery to click the menu hamburger icon
            $('.menu-icon-link').click();
            //Get the menu's state after a click
            let clickedMenuState = $('body').hasClass('menu-hidden');
            //Use jQuery to click the burger again!
            $('.menu-icon-link').click();
            //Get the menu's state after a second click
            let reclickedMenuState = $('body').hasClass('menu-hidden');
            //False is gonna mean here it's not hidden
            expect(clickedMenuState).toBe(false);
            //True means it's hidden again:
            expect(reclickedMenuState).toBe(true);

        })
    });
    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
        beforeEach(function(done) {
            // Load the Page with first feed
            loadFeed(allFeeds[0].id, function() {
                done();
            })
        });

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('should have at least one entry', function() {
            expect($('.feed .entry').length).not.toBe(0);
        });

    });
    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
        let initialContent = [],
            newContent = [];
        let initialFeedNum = -1;
        beforeEach(function(done) {
            initialFeedNum++;
            newFeedNum = initialFeedNum + 1;
            //Save the previous newContent as new initialContent (or: old content)
            if (initialFeedNum > 0) {
                initialContent = newContent;
                newContent = [];
            } else {
                loadFeed(initialFeedNum, function() {
                    $('.entry-link').each(function(index) {
                        initialContent.push({
                            "index": index,
                            "url": this.href,
                            "text": this.innerText
                        })
                    });
                });
            }
            loadFeed(newFeedNum, function() {
                newContent = [];
                $('.entry-link').each(function(index) {
                    newContent.push({
                        "index": index,
                        "url": this.href,
                        "text": this.innerText
                    })
                });
                done();
            })
        })
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        function testDiffFeeds() {
            it('should serve different entries for different feed numbers', function() {
                console.log(initialContent, newContent, initialFeedNum);
                expect(initialContent).not.toEqual(newContent);
            });
        }
        //We're gonna recall testDiffFeeds() for every pair of feeds
        for (let i = 0; i < allFeeds.length - 1; i++) {
            testDiffFeeds();
        }

    })
}());
