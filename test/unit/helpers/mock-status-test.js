const sinon = require('sinon');
const {assert} = require('chai');
const proxyquire = require('proxyquire');
const fs = require('fs');

const mockStatus = require('../../../src/helpers/mock-status');

describe("mock status", ()=>{
  it("exports and object",()=>{
    assert.isObject(mockStatus);
  });

  describe("the exported object", ()=>{
    it("has a 'extract' property",()=>{
      assert.property(mockStatus, 'extract')
    });

    describe("the 'extract' property", ()=>{
      it("is a function", ()=>{
        assert.isFunction(mockStatus.extract)
      });

      // I could alternatively handle this declaratively and iterate through an array
      // of fixtures and expectations. What do you think?
      //
      // const testCases = [
      //  {
      //    "htmlFile":'',
      //    "statusCode":'',
      //    "message":''
      //  }
      // ]

      describe("when called with the html as a first argument", ()=>{
        describe("if there are all transactions green - valid", ()=>{
          let htmlFile = "test/fixtures/mock-html/allgood.html";
          let callback = sinon.stub();

          before((done)=>{
            fs.readFile(htmlFile, 'utf8', (err, data)=>{
              if(err){
                return done(err);
              };
              html = data;

              mockStatus.extract(html, callback);
              done();
            })
          });

          it("should call the callback", ()=>{
            assert.isTrue(callback.called)
          });

          describe("callback first argument", ()=>{
            it("should be undefined", ()=>{
              assert.isUndefined(callback.firstCall.args[0]);
            });
          });

          describe("callback second argument", ()=>{
            let secondArg;

            before(()=>{
              secondArg = callback.firstCall.args[1];
            });

            it("should be an object", ()=>{
              assert.isObject(secondArg);
            });

            it("should have a 'statusCode' property set to 0",()=>{
              assert.propertyVal(secondArg, 'statusCode', 0);
            });

            it("should have a 'message' property containing 'OK'", ()=>{
              assert.property(secondArg,'message');
              assert.include(secondArg.message, 'OK');
            })
          })
        });

        describe("if there is at least one transaction red - invalid",()=>{
          let htmlFile = "test/fixtures/mock-html/invalid.html";
          let callback = sinon.stub();

          before((done)=>{
            fs.readFile(htmlFile, 'utf8', (err, data)=>{
              if(err){
                return done(err);
              };
              html = data;

              mockStatus.extract(html, callback);
              done();
            })
          });

          it("should call the callback", ()=>{
            assert.isTrue(callback.called)
          });

          describe("callback first argument", ()=>{
            it("should be undefined", ()=>{
              assert.isUndefined(callback.firstCall.args[0]);
            });
          });

          describe("callback second argument", ()=>{
            let secondArg;

            before(()=>{
              secondArg = callback.firstCall.args[1];
            });

            it("should be an object",()=>{
              assert.isObject(secondArg)
            });

            it("should have a 'statusCode' property set to 1",()=>{
              assert.propertyVal(secondArg, 'statusCode', 1)
            })

            it("should have a 'message' property containing 'invalid'",()=>{
              assert.property(secondArg, "message");
              assert.include(secondArg.message, "invalid");
            })
          });
        });

        describe("if there is a mix of passed, failed and undocumented",()=>{
          let htmlFile = "test/fixtures/mock-html/undocfailedmix.html"
          let callback = sinon.stub();

          before((done)=>{
            fs.readFile(htmlFile, 'utf8', (err, data)=>{
              if(err){
                return done(err);
              };
              html = data;

              mockStatus.extract(html, callback);
              done();
            })
          });

          it("should call the callback", ()=>{
            assert.isTrue(callback.called)
          });

          describe("callback first argument", ()=>{
            it("should be undefined", ()=>{
              assert.isUndefined(callback.firstCall.args[0]);
            });
          });

          describe("callback second argument", ()=>{
            let secondArg;

            before(()=>{
              secondArg = callback.firstCall.args[1];
            });


            it("should be an object", ()=>{
              assert.isObject(secondArg);
            });

            it("should have a 'statusCode' property set to 1",()=>{
              assert.propertyVal(secondArg, 'statusCode', 1);
            });

            it("should have a 'message' property containing 'invalid'",()=>{
              assert.property(secondArg, 'message');
              assert.include(secondArg.message, 'invalid');
            });
          });
        });

        describe("if there is at least one transaction red - undocumented",()=>{
          let htmlFile = "test/fixtures/mock-html/undoc.html"
          let callback = sinon.stub();

          before((done)=>{
            fs.readFile(htmlFile, 'utf8', (err, data)=>{
              if(err){
                return done(err);
              };
              html = data;

              mockStatus.extract(html, callback);
              done();
            })
          });

          it("should call the callback", ()=>{
            assert.isTrue(callback.called)
          });

          describe("callback first argument", ()=>{
            it("should be undefined", ()=>{
              assert.isUndefined(callback.firstCall.args[0]);
            });
          });

          describe("callback second argument", ()=>{
            let secondArg;

            before(()=>{
              secondArg = callback.firstCall.args[1];
            });


            it("should be an object", ()=>{
              assert.isObject(secondArg);
            });

            it("should have a 'statusCode' property set to 2",()=>{
              assert.propertyVal(secondArg, 'statusCode', 2);
            });

            it("should have a 'message' property containing 'undocumented'",()=>{
              assert.property(secondArg, 'message');
              assert.include(secondArg.message, 'undocumented');
            });
          });
        });

        describe("if there are no calls",()=>{
          let htmlFile = "test/fixtures/mock-html/nocalls.html"
          let callback = sinon.stub();

          before((done)=>{
            fs.readFile(htmlFile, 'utf8', (err, data)=>{
              if(err){
                return done(err);
              };
              html = data;

              mockStatus.extract(html, callback);
              done();
            })
          });

          it("should call the callback", ()=>{
            assert.isTrue(callback.called)
          });

          describe("callback first argument", ()=>{
            it("should be undefined", ()=>{
              assert.isUndefined(callback.firstCall.args[0]);
            });
          });

          describe("callback second argument", ()=>{
            let secondArg;

            before(()=>{
              secondArg = callback.firstCall.args[1];
            });


            it("should be an object", ()=>{
              assert.isObject(secondArg);
            });

            it("should have a 'statusCode' property set to 3",()=>{
              assert.propertyVal(secondArg, 'statusCode', 3);
            });

            it("should have a 'message' property containing 'no calls'",()=>{
              assert.property(secondArg, 'message');
              assert.include(secondArg.message, 'no API calls');
            });
          });

        });

        describe("if the first argument isn't a mock html",()=>{
          let htmlFile = "test/fixtures/mock-html/notamock.html"
          let callback = sinon.stub();

          before((done)=>{
            fs.readFile(htmlFile, 'utf8', (err, data)=>{
              if(err){
                return done(err);
              };
              html = data;

              mockStatus.extract(html, callback);
              done();
            })
          });

          it("should call the callback", ()=>{
            assert.isTrue(callback.called)
          });

          describe("callback first argument", ()=>{
            it("should be an Error", ()=>{
              assert.instanceOf(callback.firstCall.args[0], Error);
            });

            it("the error message should contain 'Apiary Mock HTML'",() =>{
              firstArg = callback.firstCall.args[0];
              assert.include(firstArg.message, 'Apiary Mock HTML');
            });

            it("the error statusCode code should be 4",()=>{
              firstArg = callback.firstCall.args[0];
              assert.propertyVal(firstArg, 'statusCode', 4);
            });
          });

          describe("callback second argument", ()=>{
            let secondArg;

            before(()=>{
              secondArg = callback.firstCall.args[1];
            });

            it("should be an undefined", ()=>{
              assert.isUndefined(secondArg);
            });
          });
        });
      });
    });
  });
});

