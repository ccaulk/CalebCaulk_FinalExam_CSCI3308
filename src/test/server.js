// Imports the server.js file to be tested.
let server = require("../server");
//Assertion (Test Driven Development) and Should, Expect(Behaviour driven development) library
let chai = require("chai");
// Chai HTTP provides an interface for live integration testing of the API's.
let chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);
const { expect } = chai;
var assert = chai.assert;

//Import complete

// //test cases
describe("Server!", () => {
	//test case 1 
	//testing if the reviews page loads correctly
	it("Making sure that the reviews", done => {
		//making sure resorts page loads
      chai
        .request(server)
        .get('/reviews')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    //test case 2 
	//testing adding a review works
	it("Making sure that the reviews", done => {
		//making sure resorts page loads and review was added
      chai
        .request(server)
        .post('/main/addReview')
        .send({reviewName: "A Review" , review: "Good movie"})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
})
