# geek-contracts

## for Question Provider

Based on the template raise your Question contract;

1. Change CustomeQuestion.sol and CustomeQuestion contract name;
2. Your contract must extend AbstractQuestion and pass title/description/default winner share/input type/output type to AbstractQuestion constructor;
3. Declare your own TestCase struct with your expectable input type and output type;
4. Based on your TestCase declaration, implement methods addTestCase/setTestCase/verify/getTestCasesById based on your TestCase input and output Type;

## for Answer Provider

1. Implement the method main in CustomeAnswer.sol for relative question contract;
2. The param type of input of method main is fit the TestCase declaration of the relative question contract;