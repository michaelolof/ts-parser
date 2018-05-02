import { SourceFile, Node } from 'typescript';

export function find<T>(source: SourceFile, condition: (node: Node) => boolean, instantiator: (dec: Node) => T, deepFind = true) {

  function find(onFound: (t: T) => void) {
    function iterator(sourceFile: SourceFile | Node) {
      sourceFile.forEachChild(childNode => {
        // Only a class can use a decorator. So we search for classes.
        if (condition(childNode)) {
          const t = instantiator(childNode)
          onFound(t);
        }
        if (deepFind) iterator(childNode);
      });
    }
    iterator(source);
  }

  const allPromises: Promise<T>[] = [];

  find(t => {
    const promise = new Promise<T>((resolve, reject) => {
      if (t) {
        resolve(t)
      } else {
        reject("There was an issue. Sort it out.");
      }
    });
    allPromises.push(promise);
  })

  return Promise.all(allPromises);
}

export function flexibleFind<T>(source: SourceFile, condition: (node: Node) => (T|undefined), deepFind = true):Promise<T[] | undefined> {
  function find(onFound: (t: T) => void) {
    function iterator(sourceFile: SourceFile | Node) {
      sourceFile.forEachChild(childNode => {
        // Only a class can use a decorator. So we search for classes.
        const con = condition(childNode)
        if( con ) onFound( con );
        if (deepFind) iterator(childNode);
      });
    }
    iterator(source);
  }

  const allPromises: Promise<T>[] = [];

  find(t => {
    const promise = new Promise<T>((resolve, reject) => {
      if (t) {
        resolve(t)
      } else {
        reject("There was an issue. Sort it out.");
      }
    });
    allPromises.push(promise);
  })

  return Promise.all(allPromises);

}


