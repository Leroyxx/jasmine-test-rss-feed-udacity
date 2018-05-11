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


        /* This test loops through the allFeeds object and checks that every
         * feed has a valid url (= not empty, undefined or false).
         */
        it('have a defined url', function() {
            for (const feed of allFeeds) {
                expect(feed.url).toBeTruthy();
                expect(feed.url.length).not.toBe('');
            }
        });

        /* This test checks every feed in allFeeds object has a defined non-empty name.
         */
        it('have a defined name', function() {
            for (const feed of allFeeds) {
                expect(feed.name).toBeDefined();
                expect(feed.name.length).not.toBe('');
            }
        })
    });


    /* Check if the menu is hidden by default any if it shows and hides upon clicking the hamburger icon. */
    describe('The menu', function() {
        let defaultMenuState;
        beforeEach(function() {
            //Is the menu open when the page loads?
            defaultMenuState = $('body').hasClass('menu-hidden');
        });
        /* Check if the body has the 'menu-hidden' class to see
         * if it does, the menu is hidden by default.
         */
        it('is hidden by default', function() {
            expect(defaultMenuState).toBe(true);
        });
        /* This test ensures the menu changes visibility when the menu icon is clicked.
         * It has two expectations: For both of them we first engage with the page (click) and
         * then save a boolean to a variable that decribes if the body has a 'menu-hidden' class.
         * WE ONLY AFTER THAT COMPARE THE VARIABLES clickedMenuState AND reclickedMenuState (note: 're'
         * means clicked once more) WHICH SHOULD BE BOOLEANS (because that's what jQuery returns when using hasClass)
         * TO WHAT WE EXPECT THEM TO BE: clickedMenuState should be false and reClickedMenuState
         * should be true. e.g: If the reClickedMenuState is false, the
         * body doesn't have class 'menu-hidden' so the last test in this suite fails because the menu is shown
         * after two icon clicks. Also, in this case if the first two tests in this suite passed correctly,
         * it means that specifically only clicking again hadn't changed back the body's 'menu-hidden' class.
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
            //console.log(clickedMenuState, reclickedMenuState);
            //Uncomment the above to see what's happening (these aren't the same booleans,
            //they're recorded at different times).
        })
    });
    /* This suite checks that we get at least one feed entry on startup. */
    describe('Initial Entries', function() {
        beforeEach(function(done) {
            // Load the Page with first feed
            loadFeed(allFeeds[0].id, function() {
                done();
            })
        });

        /* Check that there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test requires
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        it('should have at least one entry', function() {
            expect($('.feed .entry').length).not.toBe(0);
        });

    });
    /* Checks that we can load different feeds, note this test doesn't interact with the event listeners
     * for each of the feeds but actually just calls the loadFeed function.
     */
    describe('New Feed Selection', function() {
        let initialContent = [],
            newContent = [];
        let initialFeedNum = -1; //This gets boosted to 0 with the first loop
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
        function testDiffFeeds() {
            /* Ensure that when a new feed is loaded
            * by the loadFeed function that the content actually changes.
            * Remember, loadFeed() is asynchronous but that's taken care of with
            * passing done() as a callback in the beforeEach() part above.
            */
            it('should serve different entries for different feed numbers', function() {
                //console.log(initialContent, newContent, initialFeedNum);
                //Uncomment above for further understanding of multiple testDiffFeeds() calls
                expect(initialContent).not.toEqual(newContent);
            });
        }
        //We're gonna recall testDiffFeeds() for every pair of feeds
        for (let i = 0; i < allFeeds.length - 1; i++) {
            testDiffFeeds();
        }
    })
}());
