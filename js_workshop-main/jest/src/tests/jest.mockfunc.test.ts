import { expect, jest, describe, beforeAll, it, afterAll } from "@jest/globals";
import { MockFunctions } from '../utils/helpers/common.ts';
import axios from 'axios';

const mockFunctions = new MockFunctions();
const dbInsertResults = {
    status: "INSERT executed correctly",
    targetDB: "MockDB",
    targetTable: "reports",
    numberRecords: "1"
}

let spy: any;
describe('Mocking complex functions', () => {

    beforeAll(async () => {
        
        spy = jest.spyOn(mockFunctions, 'reportToDB').mockImplementation(async () => {
            const cards = { 
                data: [
                    {id: 1, name: "test", description: "testdec", lastActivity: new Date()}, 
                    {id: 2, name: "test", description: "testdec", lastActivity: new Date("01/01/1989")}
                ]
            };
            const dateToCompare = new Date("01/01/1990");
            const report = cards.data.filter((card: any) => {
                card.lastActivity >= dateToCompare
            });
            await mockFunctions.queryDatabase(mockFunctions.getDatabaseConnection(), 'INSERT INTO reports (data) VALUES (?)', {reportId: 1, report});
            return {
                reportId : 1, 
                results: dbInsertResults
            }
        })
    })

    it('Try to mimic reportToDB functionality', async () => {
        let result = await mockFunctions.reportToDB();

        expect(mockFunctions.reportToDB).toHaveBeenCalled();
        expect(result).toEqual({reportId: 1, results: dbInsertResults})
    });

    it('Try to check on API being called within reportToDB', async () => {
        //Return the original implementation of the function being spied/mocked
        spy.mockRestore();

        jest.spyOn(axios, 'get').mockReturnValue(new Promise(resolve => {
                resolve({data: [{id: 1}]})
            })
        );
        
        jest.spyOn(axios, 'post').mockReturnValue(new Promise(resolve => {
            resolve({})
        }))

        let result = await mockFunctions.reportToDB();

        expect(result).toHaveProperty('reportId');
        expect(result).toHaveProperty('results');
        expect(result.reportId).toStrictEqual(1);
        expect(result.results).toStrictEqual(0);
    });
})

describe('Mocking complex function: second example', () =>{
    
    let mockComplexLogic: any;

    beforeAll(async () => {
        mockComplexLogic = jest.fn().mockReturnValue('Sum of 3 and 5 is 8');
    })

    afterAll(async () => {
        //Make the object being spied/mocked to have empty implementations that only returns undefined as result
        mockComplexLogic.mockReset();

        expect(mockComplexLogic).toHaveBeenCalledTimes(0);
        expect(mockComplexLogic()).toBeUndefined();
        expect(mockComplexLogic).toHaveBeenCalledWith();
        expect(mockComplexLogic.mock.results).toEqual([{
                "type": "return",
                "value": undefined,
            }
        ]);
    })

    it('should return sum of param1 and param2 when param3 is "sum"', async () => {
        const result = await mockComplexLogic({ param1: 3, param2: 5, param3: 'sum' });
        expect(result).toBe('Sum of 3 and 5 is 8');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 3, param2: 5, param3: 'sum' });
    });

    /*
    *Undo comment to see mockName behavior
    */
    /*
    it('should break and return a name for the failed mock', async () => {
        mockComplexLogic.mockName("MockingIsFun");

        expect(mockComplexLogic).toHaveBeenLastCalledWith(0);
    })
    */
 
    it('should return unknown operation when param3 is not "sum" or "difference"', async () => {
        mockComplexLogic.mockReturnValueOnce('Unknown operation: multiply');
        const result = await mockComplexLogic({ param1: 3, param2: 5, param3: 'multiply' });
        expect(result).toBe('Unknown operation: multiply');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 3, param2: 5, param3: 'multiply' });
    });
 
    it('should return different results when returnValueOnce is implemented', async () => {
        mockComplexLogic.mockReturnValueOnce('Square of 3 is 9 and square of 5 is 25');
        mockComplexLogic.mockReturnValueOnce('Message: hello with value 3');
        mockComplexLogic.mockReturnValueOnce('Message: world with value 5');
        mockComplexLogic.mockReturnValueOnce('Square of 3 is 9');

        /*
        ** First mockReturnValueOnce
        */
        let result = await mockComplexLogic({ param1: 3, param2: 5 });
        expect(result).toBe('Square of 3 is 9 and square of 5 is 25');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 3, param2: 5 });

        /*
        ** Second mockReturnValueOnce
        */
        result = await mockComplexLogic({ param1: 3, param3: 'hello' });
        expect(result).toBe('Message: hello with value 3');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 3, param3: 'hello' });

        /*
        ** Third mockReturnValueOnce
        */
        result = await mockComplexLogic({ param2: 5, param3: 'world' });
        expect(result).toBe('Message: world with value 5');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param2: 5, param3: 'world' });

        /*
        ** Fourth mockReturnValueOnce
        */
        result = await mockComplexLogic({ param1: 3 });
        expect(result).toBe('Square of 3 is 9');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 3 });

        /*
        ** Original mockReturnValue described in beforeAll hook
        */
        result = await mockComplexLogic({ param1: 3, param2: 5, param3: 'sum' });
        expect(result).toBe('Sum of 3 and 5 is 8');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 3, param2: 5, param3: 'sum' });
    });

    it('should return difference between param1 and param2 when param3 is "difference"', async () => {
        mockComplexLogic = jest.fn().mockReturnValue('Difference between 10 and 4 is 6');

        /*
        *Clears all history for a mock (calls, instances, contexts, results)
        */
        mockComplexLogic.mockClear();

        expect(mockComplexLogic).toHaveBeenCalledTimes(0);

        const result = await mockComplexLogic({ param1: 10, param2: 4, param3: 'difference' });
        expect(result).toBe('Difference between 10 and 4 is 6');
        expect(mockComplexLogic).toHaveBeenCalledWith({ param1: 10, param2: 4, param3: 'difference' });
        expect(mockComplexLogic).toHaveBeenCalledTimes(1);
    });

    it('Should fake time for any future purpose', async () => {
        jest.useFakeTimers();
        let setSytemDate = new Date(2030, 11, 19);
        jest.setSystemTime(setSytemDate)
        let todaysDate = new Date();
        let initialDate = new Date(2030, 10, 1)
        expect(todaysDate.getTime()).toBeGreaterThan(initialDate.getTime());

        /*
        jest.useRealTimers();
        todaysDate = new Date();
        expect(todaysDate.getTime()).toBeGreaterThan(initialDate.getTime());
        */
    });
});