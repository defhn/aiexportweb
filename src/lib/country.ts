const COUNTRY_ROWS: Array<[string[], string, string, string]> = [
    [["us", "usa", "unitedstates", "unitedstatesofamerica"], "US", "United States", "North America"],
    [["uk", "unitedkingdom", "greatbritain", "britain", "england"], "GB", "United Kingdom", "Europe"],
    [["de", "germany", "deutschland"], "DE", "Germany", "Europe"],
    [["ca", "canada"], "CA", "Canada", "North America"],
    [["au", "australia"], "AU", "Australia", "Oceania"],
    [["fr", "france"], "FR", "France", "Europe"],
    [["it", "italy"], "IT", "Italy", "Europe"],
    [["es", "spain"], "ES", "Spain", "Europe"],
    [["nl", "netherlands", "holland"], "NL", "Netherlands", "Europe"],
    [["be", "belgium"], "BE", "Belgium", "Europe"],
    [["se", "sweden"], "SE", "Sweden", "Europe"],
    [["no", "norway"], "NO", "Norway", "Europe"],
    [["dk", "denmark"], "DK", "Denmark", "Europe"],
    [["fi", "finland"], "FI", "Finland", "Europe"],
    [["ch", "switzerland"], "CH", "Switzerland", "Europe"],
    [["at", "austria"], "AT", "Austria", "Europe"],
    [["pl", "poland"], "PL", "Poland", "Europe"],
    [["cz", "czechrepublic", "czechia"], "CZ", "Czech Republic", "Europe"],
    [["mx", "mexico"], "MX", "Mexico", "Latin America"],
    [["br", "brazil"], "BR", "Brazil", "Latin America"],
    [["ar", "argentina"], "AR", "Argentina", "Latin America"],
    [["jp", "japan"], "JP", "Japan", "Asia-Pacific"],
    [["kr", "southkorea", "korea"], "KR", "South Korea", "Asia-Pacific"],
    [["sg", "singapore"], "SG", "Singapore", "Asia-Pacific"],
    [["my", "malaysia"], "MY", "Malaysia", "Asia-Pacific"],
    [["th", "thailand"], "TH", "Thailand", "Asia-Pacific"],
    [["vn", "vietnam"], "VN", "Vietnam", "Asia-Pacific"],
    [["in", "india"], "IN", "India", "Asia-Pacific"],
    [["ae", "uae", "unitedarabemirates"], "AE", "United Arab Emirates", "Middle East"],
    [["sa", "saudiarabia"], "SA", "Saudi Arabia", "Middle East"],
    [["za", "southafrica"], "ZA", "South Africa", "Africa"],
];

const COUNTRY_ALIASES = new Map(
  COUNTRY_ROWS.flatMap(([aliases, code, name, group]) =>
    aliases.map((alias) => [alias, { code, name, group }] as const),
  ),
);

export type NormalizedCountry = {
  raw: string | null;
  normalizedName: string | null;
  countryCode: string | null;
  countryGroup: string;
};

function simplifyCountry(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function toTitleCase(value: string) {
  return value.replace(/\s+/g, " ").trim().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeCountryInput(value?: string | null): NormalizedCountry {
  const raw = value?.trim() ?? "";

  if (!raw) {
    return {
      raw: null,
      normalizedName: null,
      countryCode: null,
      countryGroup: "Unknown",
    };
  }

  const match = COUNTRY_ALIASES.get(simplifyCountry(raw));

  if (match) {
    return {
      raw,
      normalizedName: match.name,
      countryCode: match.code,
      countryGroup: match.group,
    };
  }

  return {
    raw,
    normalizedName: toTitleCase(raw),
    countryCode: null,
    countryGroup: "Other",
  };
}
