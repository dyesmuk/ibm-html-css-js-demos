
// // // console.log("TypeScript code");
// // // // Java 
// // // // double salary = 10.50;
// // // // TypeScript 
// // // // let salary: number = 10.50;

// // // let salary: number = 10.50;
// // // console.log(salary);
// // // // salary = "abc"; // Error in TS 
// // // console.log(salary);

// // const addNums = (a: number, b: number): number => {
// //     return a + b;
// // };

// // const output: number = addNums(10, 20);
// // console.log(output);

// let score: number | undefined = undefined;
// let abc: number | string = "";
// let def: any = "";


// // class in ts 

class Animal {
    readonly id: number;
    public name: string;
    protected species: string;
    private #sound: string;     // true private (ES2022 field)

    constructor(name: string, species: string) {
        this.id = Math.random();
        this.name = name;
        this.species = species;
        this.#sound = 'generic';
    }

    speak(): string {
        return `${this.name} says ${this.#sound}`;
    }

    get info(): string { return `${this.name} (${this.species})`; }
    set sound(value: string) { this.#sound = value; }

    static create(name: string, species: string): Animal {
        return new Animal(name, species);
    }
}
