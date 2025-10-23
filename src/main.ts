// 📌 Milestone 1
// Crea un type alias Person per rappresentare una persona generica.

// Il tipo deve includere le seguenti proprietà:

// id: numero identificativo, non modificabile
// name: nome completo, stringa non modificabile
// birth_year: anno di nascita, numero
// death_year: anno di morte, numero opzionale
// biography: breve biografia, stringa
// image: URL dell'immagine, stringa

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  imgage: string;
};

// 📌 Milestone 2
// Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:

// most_famous_movies: una tuple di 3 stringhe
// awards: una stringa
// nationality: una stringa tra un insieme definito di valori.
// Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese";
};

// 📌 Milestone 3
// Crea una funzione getActress che, dato un id, effettua una chiamata a:

// GET /actresses/:id
// La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.

// Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

function isActress(dati: unknown): dati is Actress {
  return (
    typeof dati === "object" &&
    dati !== null &&
    "id" in dati &&
    typeof dati.id === "number" && // id property
    "name" in dati &&
    typeof dati.name === "string" && // name property
    "birth_year" in dati &&
    typeof dati.birth_year === "number" && // birth_year property
    "death_year" in dati &&
    typeof dati.death_year === "number" && // death_year property
    "biography" in dati &&
    typeof dati.biography === "string" && // biography property
    "image" in dati &&
    typeof dati.image === "string" && // image property
    "most_famous_movies" in dati &&
    dati.most_famous_movies instanceof Array &&
    dati.most_famous_movies.length === 3 &&
    dati.most_famous_movies.every((m) => typeof m === "string") &&
    "awards" in dati &&
    typeof dati.awards === "string" && // awards property
    "nationality" in dati &&
    typeof dati.nationality === "string" // nationality property
  );
}

async function getActress(id: number): Promise<Actress | null> {
  try {
    const resp = await fetch(`http://localhost:3333/actress/${id}`);
    if (!resp.ok) {
      throw new Error(`Errore HTTP ${resp.status}: ${resp.statusText}`);
    }
    const dati: unknown = await resp.json();
    if (!isActress(dati)) {
      throw new Error(" Formato dati non valido");
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell' attrice", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return null;
  }
}

// 📌 Milestone 4
// Crea una funzione getAllActresses che chiama:

// GET /actresses
// La funzione deve restituire un array di oggetti Actress.

// Può essere anche un array vuoto.

async function getAllActresses(): Promise<Actress[]> {
  try {
    const resp = await fetch(`http://localhost:3333/actresses`);
    if (!resp.ok) {
      throw new Error(`Errore HTTP ${resp.status}: ${resp.statusText}`);
    }
    const dati: unknown = await resp.json();
    if (!(dati instanceof Array)) {
      throw new Error(`Formato dei dati non valido: non è un array!`);
    }
    const attriciValide: Actress[] = dati.filter(isActress);
    return attriciValide;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return [];
  }
}

// 📌 Milestone 5
// Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).

// Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.

// L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.

// La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).

async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const idsActressRequests = ids.map((id) => getActress(id));
    return await Promise.all(idsActressRequests);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero delle attrici", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return [];
  }
}

// 🎯 BONUS 1
// Crea le funzioni:

// createActress
// updateActress
// Utilizza gli Utility Types:

// Omit: per creare un'attrice senza passare id, che verrà generato casualmente.
// Partial: per permettere l’aggiornamento di qualsiasi proprietà tranne id e name.

function createActress(data: Omit<Actress, "id">): Actress {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000),
  };
}

function updateActress(actress: Actress, updates: Partial<Actress>): Actress {
  return {
    ...actress,
    ...updates,
    id: actress.id,
    name: actress.name,
  };
}

// 🎯 BONUS 2
// Crea un tipo Actor, che estende Person con le seguenti differenze rispetto ad Actress:

// known_for: una tuple di 3 stringhe
// awards: array di una o due stringhe
// nationality: le stesse di Actress più:
// Scottish, New Zealand, Hong Kong, German, Canadian, Irish.
// Implementa anche le versioni getActor, getAllActors, getActors, createActor, updateActor.

type Actor = Person & {
  known_for: [string, string, string];
  awards: [string] | [string, string];
  nationality:
    | "American"
    | "British"
    | "Australian"
    | "Israeli-American"
    | "South African"
    | "French"
    | "Indian"
    | "Israeli"
    | "Spanish"
    | "South Korean"
    | "Chinese"
    | "Scottish"
    | "New Zealand"
    | "Hong Kong"
    | "German"
    | "Canadian"
    | "Irish";
};

function isPerson(dati: unknown): dati is Person {
  return (
    typeof dati === "object" &&
    dati !== null &&
    "id" in dati &&
    typeof dati.id === "number" && // id property
    "name" in dati &&
    typeof dati.name === "string" && // name property
    "birth_year" in dati &&
    typeof dati.birth_year === "number" && // birth_year property
    "death_year" in dati &&
    typeof dati.death_year === "number" && // death_year property
    "biography" in dati &&
    typeof dati.biography === "string" && // biography property
    "image" in dati &&
    typeof dati.image === "string" // image property
  );
}

function isActor(dati: unknown): dati is Actor {
  return (
    isPerson(dati) &&
    "known_for" in dati &&
    dati.known_for instanceof Array &&
    dati.known_for.length === 3 &&
    dati.known_for.every((m) => m === "string") &&
    "awards" in dati &&
    dati.awards instanceof Array &&
    (dati.awards.length === 1 || dati.awards.length === 2) &&
    dati.awards.every((m) => m === "string") &&
    "nationality" in dati &&
    typeof dati.nationality === "string"
  );
}

async function getActor(id: number): Promise<Actor | null> {
  try {
    const resp = await fetch(`http://localhost:3333/actress/${id}`);
    if (!resp.ok) {
      throw new Error(`Errore HTTP ${resp.status}: ${resp.statusText}`);
    }
    const dati: unknown = await resp.json();
    if (!isActor(dati)) {
      throw new Error(" Formato dati non valido");
    }
    return dati;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero dell'attore", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return null;
  }
}

async function getAllActors(): Promise<Actor[]> {
  try {
    const resp = await fetch(`http://localhost:3333/actresses`);
    if (!resp.ok) {
      throw new Error(`Errore HTTP ${resp.status}: ${resp.statusText}`);
    }
    const dati: unknown = await resp.json();
    if (!(dati instanceof Array)) {
      throw new Error(`Formato dei dati non valido: non è un array!`);
    }
    const attoriValidi: Actor[] = dati.filter(isActor);
    return attoriValidi;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero degli attori", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return [];
  }
}

async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const idsActorsRequests = ids.map((id) => getActor(id));
    return await Promise.all(idsActorsRequests);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Errore durante il recupero degli attori", error);
    } else {
      console.error("Errore sconosciuto:", error);
    }
    return [];
  }
}

function createActors(data: Omit<Actor, "id">): Actor {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000),
  };
}

function updateActors(actor: Actor, updates: Partial<Actor>): Actor {
  return {
    ...actor,
    ...updates,
    id: actor.id,
    name: actor.name,
  };
}

// 🎯 BONUS 3
// Crea la funzione createRandomCouple che usa getAllActresses e getAllActors per restituire un’array che ha sempre due elementi: al primo posto una Actress casuale e al secondo posto un Actor casuale.
