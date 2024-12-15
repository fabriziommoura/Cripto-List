function getCryptoPrices() {
  const apiKey = 'b3ed1b7b-d978-413e-9e27-a2df25bf0d3a';
  const url = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
  const symbols = 'BTC,ETH,SOL,TIA,POL,ATOM,LDO,OP,ARB,SUI,STX,CKB,ZIG,NEAR,SYNT,KYVE,PENDLE,ALT,STRD,IMX,BEAM,NAKA,TAO,PHA,TRAC,FET,RLC,RENDER,ANKR,BLZ,FIL,THETA,AR,EGLD,DOGE,SNEK,BRETT,SHIB,PEPE,WIF,FLOKI,ONDO,SYRUP,RIO,AVAX,ICP,MKR,SNX,OM,LINK,PYTH,UMA,BAND,API3,INJ,APT,GNO,ASTR,SEI';
  
  const options = {
    method: 'get',
    headers: { 'X-CMC_PRO_API_KEY': apiKey },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(`${url}?symbol=${symbols}`, options);
  const data = JSON.parse(response.getContentText());

  if (!data.data || Object.keys(data.data).length === 0) {
    Logger.log('Nenhum dado retornado pela API. Verifique os símbolos ou a chave de API.');
    return;
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Lista de ativos');
  const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 4).getValues();

  const fiveDecimalCryptos = [
    'CKB', 'ZIG', 'SYNT', 'KYVE', 'ALT', 'STRD', 
    'BEA', 'ANK', 'DOGE', 'SNEK', 'SHIB', 'PEPE', 
    'FLOKI', 'ASTR'
  ];

  rows.forEach((row, index) => {
    const symbol = row[2].toUpperCase(); // Ticker na coluna

    if (data.data[symbol]) {
      const price = data.data[symbol].quote.USD.price;

      // Define o número de casas decimais
      const decimals = fiveDecimalCryptos.includes(symbol) ? 5 : 2;

      // Formata o número no padrão brasileiro com vírgula como separador decimal
      const formattedPrice = price
        .toFixed(decimals)
        .replace('.', ','); // Substitui o ponto pelo separador decimal brasileiro

      const rowNum = index + 2; // Ajusta a linha correta
      sheet.getRange(rowNum, 4).setValue(formattedPrice); // Atualiza o preço na coluna D
    } else {
      Logger.log(`Preço não encontrado para o ativo: ${symbol}`);
    }
  });
}
