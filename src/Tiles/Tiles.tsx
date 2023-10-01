import LZString from 'lz-string';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import './Tiles.css';

function generateTableau(): string[][] {
  const tableau: string[][] = Array.from({ length: 5 }, () =>
    Array(5).fill('X'),
  );
  const vIndices: number[] = randomSample(25, 9);
  const nIndices: number[] = [];

  while (nIndices.length < 3) {
    const randomIndex: number = randomInt(0, 24);
    if (!vIndices.includes(randomIndex) && !nIndices.includes(randomIndex)) {
      nIndices.push(randomIndex);
    }
  }

  for (const index of vIndices) {
    const row: number = Math.floor(index / 5);
    const col: number = index % 5;
    tableau[row][col] = 'V';
  }

  for (const index of nIndices) {
    const row: number = Math.floor(index / 5);
    const col: number = index % 5;
    tableau[row][col] = 'N';
  }

  return tableau;
}

function randomSample(max: number, count: number): number[] {
  const indices: number[] = [];
  for (let i = 0; i < count; i++) {
    let randomIndex: number;
    do {
      randomIndex = randomInt(0, max - 1);
    } while (indices.includes(randomIndex));
    indices.push(randomIndex);
  }
  return indices;
}

function randomSampleValues(array: number[], count: number): number[] {
  const indices: number[] = [];
  const values: number[] = [];
  const max = array.length;
  for (let i = 0; i < count; i++) {
    let randomIndex: number;
    do {
      randomIndex = randomInt(0, max - 1);
    } while (indices.includes(randomIndex));
    indices.push(randomIndex);
    values.push(array[randomIndex]);
  }
  return values;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function regrouperIndices(tableau: string[][]): [number[], number[], number[]] {
  const indicesV: number[] = [];
  const indicesX: number[] = [];
  const indicesN: number[] = [];

  for (let i = 0; i < tableau.length; i++) {
    for (let j = 0; j < tableau[i].length; j++) {
      if (tableau[i][j] === 'V') {
        indicesV.push(i * 5 + j);
      } else if (tableau[i][j] === 'X') {
        indicesX.push(i * 5 + j);
      } else if (tableau[i][j] === 'N') {
        indicesN.push(i * 5 + j);
      }
    }
  }

  return [indicesV, indicesX, indicesN];
}

function displayTableau(tableau: string[][]): void {
  for (const row of tableau) {
    console.log(row);
  }
}

function verifTableau(tableau1: string[][], tableau2: string[][]): boolean {
  const correspondances: { [key: string]: number } = {};

  for (let i = 0; i < tableau1.length; i++) {
    for (let j = 0; j < tableau1[i].length; j++) {
      const element1: string = tableau1[i][j];
      const element2: string = tableau2[i][j];

      const correspondance = `1: ${element1} ; 2: ${element2}`;

      if (!(correspondance in correspondances)) {
        correspondances[correspondance] = 1;
      } else {
        correspondances[correspondance] += 1;
      }
    }
  }

  let flag = true;
  for (const [correspondance, count] of Object.entries(correspondances)) {
    if (correspondance === '1: X ; 2: X' && count !== 7) {
      flag = false;
    }
    if (
      (correspondance === '1: V ; 2: X' || correspondance === '1: X ; 2: V') &&
      count !== 5
    ) {
      flag = false;
    }
    if (correspondance === '1: V ; 2: V' && count !== 3) {
      flag = false;
    }
    if (
      (correspondance === '1: N ; 2: N' ||
        correspondance === '1: N ; 2: V' ||
        correspondance === '1: V ; 2: N' ||
        correspondance === '1: X ; 2: N') &&
      count !== 1
    ) {
      flag = false;
    }
  }

  return flag;
}

function randomChoice<T>(array: T[]): T {
  const randomIndex: number = randomInt(0, array.length - 1);
  return array[randomIndex];
}

function rotate180Degrees(data: string[][]): string[][] {
  const rows = data.length;
  const cols = data[0].length;

  const rotatedData: string[][] = [];

  for (let i = rows - 1; i >= 0; i--) {
    const row: string[] = [];
    for (let j = cols - 1; j >= 0; j--) {
      row.push(data[i][j]);
    }
    rotatedData.push(row);
  }

  return rotatedData;
}

function generateLinkedTableaux(): [string[][], string[][], string[][]] {
  const tableau1: string[][] = generateTableau();
  const tableau2: string[][] = Array.from({ length: 5 }, () =>
    Array(5).fill('X'),
  );

  const vIndices: number[] = [];
  const nIndices: number[] = [];

  const [indicesV1, indicesX1, indicesN1] = regrouperIndices(tableau1);

  // Tableau d'indices de V = V
  const vInBoth: number[] = randomSampleValues(indicesV1, 3);

  for (const value of vInBoth) {
    vIndices.push(value);
    const indice = indicesV1.indexOf(value);
    indicesV1.splice(indice, 1);
  }

  // Indice N = N
  const noirInBoth: number = randomChoice(indicesN1);
  nIndices.push(noirInBoth);
  const indiceNN = indicesN1.indexOf(noirInBoth);
  indicesN1.splice(indiceNN, 1);

  // Indice V = N
  const vEgalN: number = randomChoice(indicesN1);
  vIndices.push(vEgalN);
  const indiceVN = indicesN1.indexOf(vEgalN);
  indicesN1.splice(indiceVN, 1);

  // Indice N = V
  const nEgalV: number = randomChoice(indicesV1);
  nIndices.push(nEgalV);
  const indiceNV = indicesV1.indexOf(nEgalV);
  indicesV1.splice(indiceNV, 1);

  while (vIndices.length < 9) {
    const randomIndex: number = randomInt(0, 24);
    if (
      !nIndices.includes(randomIndex) &&
      !indicesN1.includes(randomIndex) &&
      !indicesV1.includes(randomIndex) &&
      !vIndices.includes(randomIndex)
    ) {
      vIndices.push(randomIndex);
    }
  }

  while (nIndices.length < 3) {
    const randomIndex: number = randomInt(0, 24);
    if (
      !vIndices.includes(randomIndex) &&
      !indicesN1.includes(randomIndex) &&
      !indicesV1.includes(randomIndex) &&
      !nIndices.includes(randomIndex)
    ) {
      nIndices.push(randomIndex);
    }
  }

  // Relier les tableaux selon les règles
  for (const index of vIndices) {
    const row: number = Math.floor(index / 5);
    const col: number = index % 5;
    tableau2[row][col] = 'V';
  }

  for (const index of nIndices) {
    const row: number = Math.floor(index / 5);
    const col: number = index % 5;
    tableau2[row][col] = 'N';
  }

  const rotatedTableau2 = rotate180Degrees(tableau2);

  return [tableau1, tableau2, rotatedTableau2];
}

function reconstructFromSeed(seed: string): string[][] {
  const tableau: string[][] = [];

  // Initialize data2 with empty values
  for (let i = 0; i < 5; i++) {
    const row: string[] = [];
    for (let j = 0; j < 5; j++) {
      row.push('');
    }
    tableau.push(row);
  }

  let index = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      tableau[i][j] = seed[index];
      index++;
    }
  }

  return tableau;
}

// Fonction pour compresser une seed en utilisant la représentation Base64
function compressSeed(seed: string): string {
  const compressed = LZString.compressToBase64(seed);
  return compressed;
}

// Fonction pour décompresser une seed à partir de la représentation Base64
function decompressSeed(compressedSeed: string): string {
  const decompressed = LZString.decompressFromBase64(compressedSeed);
  return decompressed;
}

function countLetters(tableau: string[][]): { [key: string]: number } {
  const counts: { [key: string]: number } = { X: 0, N: 0, V: 0 };

  for (const row of tableau) {
    for (const letter of row) {
      counts[letter]++;
    }
  }

  return counts;
}

function generateUniqueSeed(data: string[][]): string {
  let seed = '';

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      seed += data[i][j];
    }
  }

  return seed;
}

function createSubarray(sourceArray: string[]): string[] {
  if (sourceArray.length <= 25) {
    // Si le tableau source a 25 éléments ou moins, retournez-le tel quel
    return sourceArray;
  } else {
    // Générez un index aléatoire pour le début du sous-tableau
    const startIndex = Math.floor(Math.random() * (sourceArray.length - 25));
    console.log('startIndex', startIndex);

    // Utilisez la méthode slice pour extraire 25 éléments à partir de l'index généré
    const subarray = sourceArray.slice(startIndex, startIndex + 25);

    return subarray;
  }
}

function createRandomSubarray(sourceArray: string[]): string[] {
  // Créez une copie de l'array source pour ne pas affecter l'original
  const shuffledArray = [...sourceArray];

  // Algorithme de mélange Fisher-Yates (ou Knuth) pour mélanger l'array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  // Utilisez la méthode slice pour extraire les 25 premiers éléments du tableau mélangé
  const subarray = shuffledArray.slice(0, 25);

  return subarray;
}

function reverseArray(arr: string[]): string[] {
  const reversedArr: string[] = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    reversedArr.push(arr[i]);
  }

  return reversedArr;
}

// function launch() {
//   // Générer les tableaux
//   // const [tableau1, tableau2] = generateLinkedTableaux();

//   // Afficher les tableaux
//   console.log('Tableau 1:');
//   displayTableau(tableau1);

//   // // Verification
//   // const letterCounts1 = countLetters(tableau1);

//   // // Affichage des résultats
//   // for (const letter in letterCounts1) {
//   //   console.log(`Letter ${letter}: ${letterCounts1[letter]}`);
//   // }

//   console.log('\nTableau 2:');
//   displayTableau(tableau2);

//   // const letterCounts2 = countLetters(tableau2);

//   // // Affichage des résultats
//   // for (const letter in letterCounts2) {
//   //   console.log(`Letter ${letter}: ${letterCounts2[letter]}`);
//   // }

//   // Correspondances
//   const flag = verifTableau(tableau1, tableau2);
//   console.log('Tableau est correct ?', flag);
// }

// Appel de la fonction launch

const Tiles = () => {
  const [playersPosition, setPlayersPosition] = useState(false);
  const [crossPositionTableau1, setCrossPositionTableau1] = useState<
    [number, number]
  >([0, 0]);
  const [crossPositionTableau2, setCrossPositionTableau2] = useState<
    [number, number]
  >([4, 4]);
  const [wordlist, setWordlist] = useState<string[]>([]);
  const [subarrayWordlist1, setSubarrayWordlist1] = useState<string[]>([]);
  const [subarrayWordlist2, setSubarrayWordlist2] = useState<string[]>([]);
  const [tableau1, setTableau1] = useState<string[][]>([]);
  const [tableau2, setTableau2] = useState<string[][]>([]);
  const [tableReconstruct, setTableReconstruct] = useState<string[][]>([]);
  const [flag, setFlag] = useState(false);
  const [showTable1, setShowTable1] = useState(false);
  const [showTable2, setShowTable2] = useState(false);
  const [showTableReconstruct, setShowTableReconstruct] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [seedTable1, setSeedTable1] = useState('');
  const [seedTable2, setSeedTable2] = useState('');
  const [seedTableReconstruct, setSeedTableReconstruct] = useState('');
  const [showSeedTable1, setShowSeedTable1] = useState(false);
  const [showSeedTable2, setShowSeedTable2] = useState(false);
  const [showSeedTableReconstruct, setShowSeedTableReconstruct] =
    useState(false);
  const [hideWords, setHideWords] = useState(false); // Ajoutez cet état

  useEffect(() => {
    // Met à jour la largeur de la fenêtre lorsqu'elle est redimensionnée
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // const listMot = await fetchData();
    // setWordlist(listMot);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const [tableau1G, tableau2G, rotatedTableau2G] = generateLinkedTableaux();
    setFlag(verifTableau(tableau1G, tableau2G));
    setPlayersPosition(false);
    setCrossPositionTableau1([0, 0]);
    setCrossPositionTableau2([4, 4]);

    setTableau1(tableau1G);
    setTableau2(rotatedTableau2G);

    const fetchWordList = async () => {
      const response = await fetch('../src/listFR_codenames.txt');
      const data = await response.text();
      const array = data.split('\n').filter(item => item.trim() !== '');
      setWordlist(array);
    };

    fetchWordList();

    const subarrayWordlist: string[] = createRandomSubarray(wordlist);
    console.log('subarrayWordlist', subarrayWordlist);
    setSubarrayWordlist1(subarrayWordlist);

    const reverseSubarrayWordlist: string[] = reverseArray(subarrayWordlist);
    setSubarrayWordlist2(reverseSubarrayWordlist);

    const seed = generateUniqueSeed(tableau1G);
    const compressedSeed = compressSeed(seed);
    setSeedTable1(compressedSeed);
    // const decompressedSeed = decompressSeed(compressedSeed);

    const seed2 = generateUniqueSeed(rotatedTableau2G);
    const compressedSeed2 = compressSeed(seed2);
    setSeedTable2(compressedSeed2);
    // const decompressedSeed2 = decompressSeed(compressedSeed2);
  }, [refresh]);

  const handleChangeSeed = (event: ChangeEvent<HTMLInputElement>) => {
    setSeedTableReconstruct(event.target.value);
  };

  const handleSubmitSeed = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Effectuez ici les actions souhaitées avec la valeur du champ texte

    const decompressedSeed = decompressSeed(seedTableReconstruct);
    const tableReconstruct = reconstructFromSeed(decompressedSeed);
    setTableReconstruct(tableReconstruct);
    setShowTableReconstruct(!showTableReconstruct);
    setShowSeedTableReconstruct(!showSeedTableReconstruct);
  };

  const rotate180Table = (tableNumber: number) => {
    setPlayersPosition(!playersPosition);

    if (tableNumber === 1) {
      if (
        crossPositionTableau1.length === 2 &&
        crossPositionTableau1[0] === 0 &&
        crossPositionTableau1[1] === 0
      ) {
        setCrossPositionTableau1([4, 4]);
      } else {
        setCrossPositionTableau1([0, 0]);
      }

      const tableauTemp = tableau1;
      const rotatedTableau1 = rotate180Degrees(tableauTemp);

      //Reverse words
      const arrayReversed = reverseArray(subarrayWordlist1);
      setSubarrayWordlist1(arrayReversed);

      setTableau1(rotatedTableau1);
    } else if (tableNumber === 2) {
      if (
        crossPositionTableau2.length === 2 &&
        crossPositionTableau2[0] === 0 &&
        crossPositionTableau2[1] === 0
      ) {
        setCrossPositionTableau2([4, 4]);
      } else {
        setCrossPositionTableau2([0, 0]);
      }

      const tableauTemp = tableau2;
      const rotatedTableau2 = rotate180Degrees(tableauTemp);

      //Reverse words
      const arrayReversed = reverseArray(subarrayWordlist2);
      setSubarrayWordlist2(arrayReversed);

      setTableau2(rotatedTableau2);
    }
  };

  const generateGridItems = (
    data: string[][],
    crossIndex: number[],
    tableauNumber: number,
  ): JSX.Element[] => {
    const gridItems: JSX.Element[] = [];

    // Fonction pour déterminer si une couleur est sombre ou claire
    const isColorDark = (color: string): boolean => {
      // Convertir la couleur en RGB
      const rgb = parseInt(color.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = rgb & 0xff;

      // Calculer la luminosité en fonction de la formule Y = 0.299*R + 0.587*G + 0.114*B
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;

      // Si la luminosité est inférieure à 128, la couleur est sombre
      return brightness < 110;
    };

    let motIndex = 0;

    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
        const cell: string = data[rowIndex][columnIndex];
        const color: string = getColorForLetter(cell);
        const isCross: boolean =
          rowIndex === crossIndex[0] && columnIndex === crossIndex[1];

        const gridItemLayout: Layout = {
          i: `${rowIndex}-${columnIndex}`,
          x: columnIndex,
          y: rowIndex,
          w: 1,
          h: 1,
        };

        // Si c'est la première case, ajoutez le texte "test" centré
        // let gridItemContent: JSX.Element | string = '';

        // Obtenir un mot aléatoire à partir du tableau de mots
        let appropriateWord = '';
        if (tableauNumber === 1) {
          appropriateWord = subarrayWordlist1[motIndex];
        } else if (tableauNumber === 2) {
          appropriateWord = subarrayWordlist2[motIndex];
        }
        const gridItemContent = appropriateWord;
        motIndex++;

        const textColor: string = isColorDark(color) ? 'white' : 'black';

        // Définir l'ombre du texte
        const textShadow: string =
          textColor === 'white'
            ? `0 0 10px rgba(255, 255, 255, 0.7)`
            : `2px 2px 4px rgba(0, 0, 0, 0.2)`;

        // const gridItem = (
        //   <div
        //     key={`${rowIndex}-${columnIndex}`}
        //     style={{
        //       background: color,
        //       color: textColor,
        //       textShadow: textShadow, // Ajouter l'effet d'ombre ici
        //       position: 'relative',
        //       display: 'flex',
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //       height: '100%',
        //     }}
        //     className={`grid-item grid-cell ${isCross ? 'crossed' : ''}`}
        //     data-grid={gridItemLayout}
        //   >
        //     {gridItemContent}
        //   </div>
        // );

        const gridItem = (
          <div
            key={`${rowIndex}-${columnIndex}`}
            style={{
              background: color,
              color: textColor,
              textShadow: textShadow,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
            className={`grid-item grid-cell ${isCross ? 'crossed' : ''}`}
            data-grid={gridItemLayout}
          >
            {hideWords ? '' : gridItemContent} {/* Ajoutez cette condition */}
          </div>
        );

        gridItems.push(gridItem);
      }
    }

    return gridItems;
  };

  const generateGridItemsWithoutCross = (data: string[][]): JSX.Element[] => {
    const gridItems: JSX.Element[] = [];
    for (let rowIndex = 0; rowIndex < 5; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 5; columnIndex++) {
        const cell: string = data[rowIndex][columnIndex];
        const color: string = getColorForLetter(cell);

        const gridItemLayout: Layout = {
          i: `${rowIndex}-${columnIndex}`,
          x: columnIndex,
          y: rowIndex,
          w: 1,
          h: 1,
        };

        const gridItem = (
          <div
            key={`${rowIndex}-${columnIndex}`}
            style={{
              background: color,
              position: 'relative',
            }}
            className={`grid-item grid-cell `}
            data-grid={gridItemLayout}
          ></div>
        );

        gridItems.push(gridItem);
      }
    }
    return gridItems;
  };

  const getColorForLetter = (letter: string): string => {
    switch (letter) {
      case 'X':
        return '#c8ad7f'; // Beige foncé
      case 'V':
        return '#08CC0A'; // Vert clair
      case 'N':
        return '#383E42'; // Gris foncé
      default:
        return 'gray';
    }
  };

  const tableWidth = Math.min(windowWidth / 2 - 20, 600); // Calcul de la largeur des tableaux en fonction de l'espace disponible

  return flag ? (
    <div>
      <form
        onSubmit={handleSubmitSeed}
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <input
          type="text"
          value={seedTableReconstruct}
          onChange={handleChangeSeed}
        />
        <button type="submit">Générer avec seed</button>
      </form>

      <button
        id="toggleButton"
        onClick={() => setHideWords(!hideWords)}
      >
        Afficher / Cacher les mots
      </button>

      <button onClick={() => setShowTable1(!showTable1)}>
        Afficher/Masquer Tableau 1
      </button>
      <button onClick={() => setShowTable2(!showTable2)}>
        Afficher/Masquer Tableau 2
      </button>

      <button onClick={() => setShowSeedTable1(!showSeedTable1)}>
        Afficher/Masquer Seed Tableau 1
      </button>
      <button onClick={() => setShowSeedTable2(!showSeedTable2)}>
        Afficher/Masquer Seed Tableau 2
      </button>

      <button onClick={() => setRefresh(!refresh)}>
        Générer nouveaux tableaux
      </button>

      <p>
        <b> Assurez-vous toujours d'avoir le même mot entouré en rouge !</b>
      </p>
      {playersPosition ? (
        <p>Les joueurs sont côte à côte</p>
      ) : (
        <p>Les joueurs sont face à face</p>
      )}

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <div className="table-container">
              {showTable1 && (
                <div
                  className="tableau1"
                  style={{ marginRight: '20px', width: tableWidth }}
                >
                  <h2 style={{ textAlign: 'center' }}>Tableau 1</h2>
                  <GridLayout
                    cols={5}
                    rowHeight={50}
                    width={tableWidth}
                  >
                    {generateGridItems(tableau1, crossPositionTableau1, 1)}
                  </GridLayout>
                </div>
              )}

              {showSeedTable1 && (
                <div
                  className="tableau1"
                  style={{ marginRight: '20px', width: tableWidth }}
                >
                  La seed du tableau 1 est : {seedTable1}
                </div>
              )}
            </div>

            <div className="button-container">
              <button onClick={() => rotate180Table(1)}>
                Retourner tableau 1
              </button>
            </div>
          </div>

          <div className="table-container">
            <div style={{ textAlign: 'left' }}>
              {showTable2 && (
                <div
                  className="tableau1"
                  style={{ marginRight: '20px', width: tableWidth }}
                >
                  <h2 style={{ textAlign: 'center' }}>Tableau 2</h2>
                  <GridLayout
                    cols={5}
                    rowHeight={50}
                    width={tableWidth}
                  >
                    {generateGridItems(tableau2, crossPositionTableau2, 2)}
                  </GridLayout>
                </div>
              )}
              {showSeedTable2 && (
                <div
                  className="tableau1"
                  style={{ marginRight: '20px', width: tableWidth }}
                >
                  La seed du tableau 2 est : {seedTable2}
                </div>
              )}
              <div className="button-container">
                <button onClick={() => rotate180Table(2)}>
                  Retourner tableau 2
                </button>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            {showTableReconstruct && (
              <div
                className="tableau1"
                style={{ marginRight: '20px', width: tableWidth }}
              >
                <h2 style={{ textAlign: 'center' }}>Tableau reconstrui</h2>
                <GridLayout
                  cols={5}
                  rowHeight={50}
                  width={tableWidth}
                >
                  {generateGridItemsWithoutCross(tableReconstruct)}
                </GridLayout>
              </div>
            )}
            {showSeedTableReconstruct && (
              <div
                className="tableau1"
                style={{ marginRight: '20px', width: tableWidth }}
              >
                La seed du tableau reconstrui est : {seedTableReconstruct}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Les tableaux générés ne sont pas corrects. Merci d'en regénérer.</div>
  );
};

export default Tiles;
