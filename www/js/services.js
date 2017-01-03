angular.module('starter.services', [])
  .factory('partyData', function($http, $q) {

    var partyData={"parties": {
      "partyId": "1044377548",
      "partyInternalId": {"CISInternalId":    {
        "CISCIN": "P1658500A",
        "CISCINSfx": "00"
      }},
      "partyDetl": {"partyRetail":    {
        "partyName":       {
          "fullName": "MR1403_CIN003",
          "salutation": "MR"
        },
        "partyType": "R",
        "industry": "070101",
        "birthDate": "1976-01-01",
        "gender": "M",
        "nationality": "840",
        "nationalityDesc": "UNITED STATES",
        "residenceCtry": "702",
        "residenceCtryDesc": "SINGAPORE",
        "race": "4",
        "raceDesc": "OTHERS",
        "maritalStatus": "2",
        "maritalStatusDesc": "MARRIED",
        "employment":       {
          "employerName": "IBM",
          "occupationGroup": "00",
          "occupation": "IT"
        },
        "isMinor": "false",
        "isGSTResident": "true"
      }},
      "contacts":    {
        "phoneDetl": {"item": [      {
          "phoneInternalId": "1-0",
          "phone":          {
            "phoneType": "01",
            "phoneNumber": "11111111111111111111"
          },
          "isPrefPhone": "false",
          "isDoNotSpam": "false"
        }]},
        "emailDetl": {"item": [      {
          "emailAddressDetl":          {
            "emailAddressType": "OFF",
            "emailAddress": "MR1403TEST27SUAT1BANK.DBS.COM"
          },
          "isPrefEmail": "true",
          "isDoNotSpam": "false",
          "emailSourceDesc": "CSSP",
          "lastUpdId": "DRADBNR2 P"
        }]},
        "partyAddressDetl": {"item":       [
          {
            "addressInternalId": "HOM",
            "addressType": "MAIL",
            "partyAddress":             {
              "addressLine1": "SDSDSA",
              "block": "12",
              "level": "1",
              "unit": "1",
              "postalCode": "420002"
            },
            "lastUpdDate": "2016-12-31",
            "isPrefAddress": "false"
          },
          {
            "addressInternalId": "AD1",
            "addressType": "MAIL",
            "partyAddress":             {
              "addressLine1": "26 BEDOK PLACE",
              "addressLine2": "BEDOK GROVE",
              "block": "23",
              "level": "15",
              "unit": "1",
              "postalCode": "486099"
            },
            "lastUpdDate": "2017-01-02",
            "isPrefAddress": "false"
          },
          {
            "addressInternalId": "RES",
            "addressType": "RES",
            "partyAddress":             {
              "addressLine1": "SADSAD",
              "block": "12",
              "level": "1",
              "unit": "1",
              "postalCode": "420001"
            },
            "lastUpdDate": "2016-12-31",
            "isPrefAddress": "false"
          }
        ]}
      },
      "partyClassification": {"partyOwnerDetl": {"item": [   {
        "partyOwner": "0001",
        "partyOwnerDesc": "PERSONAL BANKING",
        "partySegmentDetl":       {
          "segmentLevel1": "01",
          "segmentLevel2": "0001",
          "segmentLevel3": "004631"
        }
      }]}},
      "partyRiskScoreDetl": "",
      "taxRelated": {"taxDetl": {"item": [   {
        "taxResidenceCtry": "840",
        "taxReviewStatus": "R1",
        "lastUpdDate": "2017-01-02",
        "lastUpdTime": "16:35:31",
        "lastUpdMainUnit": "0001",
        "lastUpdId": "P90TC25"
      }]}},
      "addnlInformation":    {
        "isStaff": "false",
        "partyCreateDate": "2016-12-31",
        "lastUpdDate": "2017-01-02"
      }
    }};

    return{

      getAccessToken: function(apiKey, uuid){

        var defer= $q.defer();

        var req = {
          method: 'GET',
          //url: 'https://10.91.74.225:10443/api/sg/v1/accessToken',
          //url: 'https://x01gcapicloud1:10443/api/sg/v1/accessToken',
          //url: 'https://dbs-developers.com:10443/api/sg/v1/accessToken/',
          url: 'https://52.74.36.47:10443/api/sg/v1/accessToken',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'uuid'  : uuid
          },
          data: {
            'partnerid' : "PWEB",
            'appid' : '0001',
            'userid' : 'pwebuser'
          },
          transformResponse: function(data){
            var x2js = new X2JS();
            var json = x2js.xml_str2json( data );
            return json;
          }
        }

        $http(req).then(function(response){
          console.log('successfully gotten Access Token:');
          console.log(response.data);

          defer.resolve(response.data);

        }, function(response){
          console.log('Access Token retrieval failed');
          console.log(response);

          defer.reject(response);

        });

        return defer.promise;

      },
      searchParty: function(apiKey, uuid, accessToken, partialID, birthDate){

        var defer= $q.defer();

        var req = {
          method: 'GET',
          //url: 'https://10.91.74.225:10443/api/sg/v1/accessToken',
          //url: 'https://x01gcapicloud1:10443/api/sg/v1/accessToken',
          //url: 'https://dbs-developers.com:10443/api/sg/v1/accessToken/',
          url: 'https://x01sapimgw1z.uat.dbs.com:10443/api/sg/v1/parties/search?birthDate=' + birthDate + '&partialPartyId=' + partialID + '&nameMatchReq=2',
          headers: {
            'Content-Type'  : 'application/json',
            'Authorization' :  accessToken,
            'uuid'          :  uuid,
            'apikey'        :  apiKey,
            'orgcode'       :  '0001',
            'partnername'   :  'PWCB'
          }
        }

        $http(req).then(function(response){
          console.log('successfully gotten partyID:');
          console.log(response.data);

          defer.resolve(response.data);

        }, function(response){
          console.log('partyID retrieval failed');
          console.log(response);

          defer.reject(response);

        });

        return defer.promise;

      },
      retrieveParty:  function(apiKey, uuid, accessToken,partyID){

        var defer= $q.defer();

        var req = {
          method: 'GET',
          //url: 'https://10.91.74.225:10443/api/sg/v1/accessToken',
          //url: 'https://x01gcapicloud1:10443/api/sg/v1/accessToken',
          //url: 'https://dbs-developers.com:10443/api/sg/v1/accessToken/',
          url: 'https://x01sapimgw1z.uat.dbs.com:10443/api/sg/v1/parties/' + partyID ,
          headers: {
            'Content-Type'  : 'application/json',
            'Authorization' :  accessToken,
            'uuid'          :  uuid,
            'apikey'        :  apiKey,
            'orgcode'       :  '0001',
            'partnername'   :  'PWCB'
          }
        }

        $http(req).then(function(response){
          console.log('successfully gotten partyData:');
          console.log(response.data);

          defer.resolve(response.data);

        }, function(response){
          console.log('partyData retrieval failed');
          console.log(response);

          defer.reject(response);

        });

        return defer.promise;
      },
      retrievePartyMock:  function(apiKey, uuid, accessToken,partyID){

        var defer= $q.defer();

        defer.resolve(partyData);

        return defer.promise;
      },
      createParty: function(apiKey, uuid, accessToken, newUserReq){

        var defer= $q.defer();

        var req = {
          method: 'POST',
          url: 'https://dbs-developers.com:10443/api/sg/v1/parties/',
          headers: {
            'Content-Type': 'application/json',
            'apiKey':  apiKey,
            'uuid'  : uuid,
            'Authorization': accessToken
          },
          data: newUserReq.parties
        }

        $http(req).then(function(response){
          defer.resolve(response.data);
        }, function(response){
          defer.reject(response);
        });

        return defer.promise;

      }

    };

  })
  .factory('productData', function($http, $q) {

    var productData= {"partiesProducts": {
      "partyId": "1044377548",
      "productsList": {"item":    [
        {"depositAccount":       {
          "accountNumber": "01200011860009",
          "accountId": "1967078576",
          "productType": "SA",
          "productCode": "0010",
          "productDesc": "DBS eSAVINGS PLUS - EP",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0089",
          "accountStatusDetl":          {
            "accountStatus": "01",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "03010327600009",
          "accountId": "1311645964",
          "productType": "POSBSA",
          "productCode": "0011",
          "productDesc": "POSB PASSBOOK SAVINGS",
          "accountType": "01",
          "accountSignatoryType": "02",
          "schemeType": "0004",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "03020981200005",
          "accountId": "1087921977",
          "productType": "POSBSA",
          "productCode": "0011",
          "productDesc": "POSB PASSBOOK SAVINGS",
          "accountType": "01",
          "accountSignatoryType": "02",
          "schemeType": "0004",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "03020981210003",
          "accountId": "1160863542",
          "productType": "POSBSA",
          "productCode": "0011",
          "productDesc": "POSB Everyday Savings",
          "accountType": "01",
          "accountSignatoryType": "03",
          "schemeType": "0080",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "05560333770007",
          "accountId": "1242564547",
          "productType": "POSBSA",
          "productCode": "0011",
          "productDesc": "MYSAVINGS ACCOUNT",
          "accountType": "01",
          "accountSignatoryType": "03",
          "schemeType": "0003",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "05590672480003",
          "accountId": "2027044325",
          "productType": "POSBSA",
          "productCode": "0011",
          "productDesc": "MYSAVINGS ACCOUNT",
          "accountType": "01",
          "accountSignatoryType": "03",
          "schemeType": "0003",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00019942420000",
          "accountId": "1257953291",
          "productType": "CA",
          "productCode": "0020",
          "productDesc": "DBS CURRENT ACCOUNT",
          "accountType": "01",
          "accountSignatoryType": "02",
          "schemeType": "0009",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00030011520006",
          "accountId": "1605766142",
          "productType": "CA",
          "productCode": "0020",
          "productDesc": "DBS CURRENT ACCOUNT",
          "accountType": "01",
          "accountSignatoryType": "02",
          "schemeType": "0009",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "01200005600004",
          "accountId": "2069216806",
          "productType": "CA",
          "productCode": "0020",
          "productDesc": "SY_31082017",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0114",
          "accountStatusDetl":          {
            "accountStatus": "09",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00019942390000",
          "accountId": "1748145264",
          "productType": "CA",
          "productCode": "0021",
          "productDesc": "Multi Currency Account",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0017",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00019942400003",
          "accountId": "1521438471",
          "productType": "CA",
          "productCode": "0021",
          "productDesc": "Multi Currency Account",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0017",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00019942410001",
          "accountId": "1331831457",
          "productType": "CA",
          "productCode": "0021",
          "productDesc": "Multi Currency Account",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0017",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00030011500000",
          "accountId": "2006190591",
          "productType": "CA",
          "productCode": "0021",
          "productDesc": "Multi Currency Account",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0017",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "00030011510008",
          "accountId": "1558282518",
          "productType": "CA",
          "productCode": "0021",
          "productDesc": "Multi Currency Account",
          "accountType": "01",
          "accountSignatoryType": "01",
          "schemeType": "0017",
          "accountStatusDetl":          {
            "accountStatus": "02",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "012000026812",
          "accountId": "1521766283",
          "productType": "FD",
          "productCode": "0030",
          "productDesc": "S$ FIXED DEPOSIT",
          "accountType": "01",
          "accountSignatoryType": "01",
          "accountStatusDetl":          {
            "accountStatus": "10",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "012000029116",
          "accountId": "1473494161",
          "productType": "FD",
          "productCode": "0030",
          "productDesc": "S$ FIXED DEPOSIT",
          "accountType": "01",
          "accountSignatoryType": "01",
          "accountStatusDetl":          {
            "accountStatus": "10",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"depositAccount":       {
          "accountNumber": "01200001427",
          "accountId": "1553643926",
          "productType": "FCFD",
          "productCode": "0031",
          "productDesc": "FOREIGN CURRENCY FIXED DEPOSIT",
          "accountType": "01",
          "accountSignatoryType": "01",
          "accountStatusDetl":          {
            "accountStatus": "01",
            "accountStatusReasonCode": "0"
          },
          "isMultiplierAccount": "false"
        }},
        {"service":       {
          "accountNumber": "P000000070158441",
          "accountId": "1669865008",
          "channelId": "03"
        }}
      ]}
    }};


    return {

      getListMock: function(apiKey, uuid, accessToken, partyID) {

        var defer= $q.defer();

        defer.resolve(productData);

        return defer.promise;

      },
      getList: function (apiKey, uuid, accessToken, partyID) {

        var defer= $q.defer();

        var req = {
          method: 'GET',
          //url: 'https://10.91.74.225:10443/api/sg/v1/accessToken',
          //url: 'https://x01gcapicloud1:10443/api/sg/v1/accessToken',
          //url: 'https://dbs-developers.com:10443/api/sg/v1/accessToken/',
          url: 'https://x01sapimgw1z.uat.dbs.com:10443/api/sg/v1/parties/' + partyID + '/products' ,
          headers: {
            'Content-Type'  : 'application/json',
            'Authorization' :  accessToken,
            'uuid'          :  uuid,
            'apikey'        :  apiKey,
            'orgcode'       :  '0001',
            'partnername'   :  'PWCB'
          }
        }

        $http(req).then(function(response){
          console.log('successfully gotten productData:');
          console.log(response.data);

          defer.resolve(response.data);

        }, function(response){
          console.log('productData retrieval failed');
          console.log(response);

          defer.reject(response);

        });

        return defer.promise;

      }
    };
  })
  .factory('NationalityCountriesRaceList', function() {
  var nationalityData=["Afghan",
            "Albanian",
            "Algerian",
            "American",
            "Andorran",
            "Angolan",
            "Antiguans",
            "Argentinean",
            "Armenian",
            "Australian",
            "Austrian",
            "Azerbaijani",
            "Bahamian",
            "Bahraini",
            "Bangladeshi",
            "Barbadian",
            "Barbudans",
            "Batswana",
            "Belarusian",
            "Belgian",
            "Belizean",
            "Beninese",
            "Bhutanese",
            "Bolivian",
            "Bosnian",
            "Brazilian",
            "British",
            "Bruneian",
            "Bulgarian",
            "Burkinabe",
            "Burmese",
            "Burundian",
            "Cambodian",
            "Cameroonian",
            "Canadian",
            "Cape Verdean",
            "Central African",
            "Chadian",
            "Chilean",
            "Chinese",
            "Colombian",
            "Comoran",
            "Congolese",
            "Congolese",
            "Costa Rican",
            "Croatian",
            "Cuban",
            "Cypriot",
            "Czech",
            "Danish",
            "Djibouti",
            "Dominican",
            "Dominican",
            "Dutch",
            "Dutchman",
            "Dutchwoman",
            "East Timorese",
            "Ecuadorean",
            "Egyptian",
            "Emirian",
            "Equatorial Guinean",
            "Eritrean",
            "Estonian",
            "Ethiopian",
            "Fijian",
            "Filipino",
            "Finnish",
            "French",
            "Gabonese",
            "Gambian",
            "Georgian",
            "German",
            "Ghanaian",
            "Greek",
            "Grenadian",
            "Guatemalan",
            "Guinea-Bissauan",
            "Guinean",
            "Guyanese",
            "Haitian",
            "Herzegovinian",
            "Honduran",
            "Hungarian",
            "I-Kiribati",
            "Icelander",
            "Indian",
            "Indonesian",
            "Iranian",
            "Iraqi",
            "Irish",
            "Irish",
            "Israeli",
            "Italian",
            "Ivorian",
            "Jamaican",
            "Japanese",
            "Jordanian",
            "Kazakhstani",
            "Kenyan",
            "Kittian and Nevisian",
            "Kuwaiti",
            "Kyrgyz",
            "Laotian",
            "Latvian",
            "Lebanese",
            "Liberian",
            "Libyan",
            "Liechtensteiner",
            "Lithuanian",
            "Luxembourger",
            "Macedonian",
            "Malagasy",
            "Malawian",
            "Malaysian",
            "Maldivan",
            "Malian",
            "Maltese",
            "Marshallese",
            "Mauritanian",
            "Mauritian",
            "Mexican",
            "Micronesian",
            "Moldovan",
            "Monacan",
            "Mongolian",
            "Moroccan",
            "Mosotho",
            "Motswana",
            "Mozambican",
            "Namibian",
            "Nauruan",
            "Nepalese",
            "Netherlander",
            "New Zealander",
            "Ni-Vanuatu",
            "Nicaraguan",
            "Nigerian",
            "Nigerien",
            "North Korean",
            "Northern Irish",
            "Norwegian",
            "Omani",
            "Pakistani",
            "Palauan",
            "Panamanian",
            "Papua New Guinean",
            "Paraguayan",
            "Peruvian",
            "Polish",
            "Portuguese",
            "Qatari",
            "Romanian",
            "Russian",
            "Rwandan",
            "Saint Lucian",
            "Salvadoran",
            "Samoan",
            "San Marinese",
            "Sao Tomean",
            "Saudi",
            "Scottish",
            "Senegalese",
            "Serbian",
            "Seychellois",
            "Sierra Leonean",
            "Singaporean",
            "Slovakian",
            "Slovenian",
            "Solomon Islander",
            "Somali",
            "South African",
            "South Korean",
            "Spanish",
            "Sri Lankan",
            "Sudanese",
            "Surinamer",
            "Swazi",
            "Swedish",
            "Swiss",
            "Syrian",
            "Taiwanese",
            "Tajik",
            "Tanzanian",
            "Thai",
            "Togolese",
            "Tongan",
            "Trinidadian or Tobagonian",
            "Tunisian",
            "Turkish",
            "Tuvaluan",
            "Ugandan",
            "Ukrainian",
            "Uruguayan",
            "Uzbekistani",
            "Venezuelan",
            "Vietnamese",
            "Welsh",
            "Welsh",
            "Yemenite",
            "Zambian",
            "Zimbabwean"];

    var raceData=["Malay",
                  "Indian",
                  "Chinese",
                  "Caucasian",
                  "Others"];

    var countriesData=[
      "Afghanistan",
      "Aland Islands",
      "Albania",
      "Algeria",
      "American Samoa",
      "AndorrA",
      "Angola",
      "Anguilla",
      "Antarctica",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bermuda",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Bouvet Island",
      "Brazil",
      "British Indian Ocean Territory",
      "Brunei Darussalam",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Cayman Islands",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Christmas Island",
      "Cocos (Keeling) Islands",
      "Colombia",
      "Comoros",
      "Congo",
      "Congo, The Democratic Republic of the",
      "Cook Islands",
      "Costa Rica",
      "Cote D'Ivoire",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Falkland Islands (Malvinas)",
      "Faroe Islands",
      "Fiji",
      "Finland",
      "France",
      "French Guiana",
      "French Polynesia",
      "French Southern Territories",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Gibraltar",
      "Greece",
      "Greenland",
      "Grenada",
      "Guadeloupe",
      "Guam",
      "Guatemala",
      "Guernsey",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Heard Island and Mcdonald Islands",
      "Holy See (Vatican City State)",
      "Honduras",
      "Hong Kong",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran, Islamic Republic Of",
      "Iraq",
      "Ireland",
      "Isle of Man",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jersey",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea, Democratic People's Republic of",
      "Korea, Republic of",
      "Kuwait",
      "Kyrgyzstan",
      "Lao People'S Democratic Republic",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libyan Arab Jamahiriya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macao",
      "Macedonia, The Former Yugoslav Republic of",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Martinique",
      "Mauritania",
      "Mauritius",
      "Mayotte",
      "Mexico",
      "Micronesia, Federated States of",
      "Moldova, Republic of",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Montserrat",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "Netherlands Antilles",
      "New Caledonia",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Niue",
      "Norfolk Island",
      "Northern Mariana Islands",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestinian Territory, Occupied",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Pitcairn",
      "Poland",
      "Portugal",
      "Puerto Rico",
      "Qatar",
      "Reunion",
      "Romania",
      "Russian Federation",
      "RWANDA",
      "Saint Helena",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Pierre and Miquelon",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Georgia and the South Sandwich Islands",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Svalbard and Jan Mayen",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syrian Arab Republic",
      "Taiwan, Province of China",
      "Tajikistan",
      "Tanzania, United Republic of",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tokelau",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Turks and Caicos Islands",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "United States Minor Outlying Islands",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela",
      "Viet Nam",
      "Virgin Islands, British",
      "Virgin Islands, U.S.",
      "Wallis and Futuna",
      "Western Sahara",
      "Yemen",
      "Zambia",
      "Zimbabwe"
    ];

    var documentType=[
      {
      "docType": "01",
      "docTypeDesc": "Singapore ID"
    },
      {"docType":"02",
      "docTypeDesc":"Hong Kong ID"},

      {"docType":"03",
      "docTypeDesc":"Thai ID"},
      {"docType":"04",
      "docTypeDesc":"Macau ID"},
      {"docType":"05",
      "docTypeDesc":"Macau Bilhete Identidade"},
      {"docType":"06",
      "docTypeDesc":"Identity Card – Foreign"},
      {"docType":"07",
      "docTypeDesc":"Taiwan ID – Citizens"},
      {"docType":"08",
      "docTypeDesc":"Taiwan ID – Foreigners"},
      {"docType":"09",
      "docTypeDesc":"China ID (Shen Feng Zheng)"},
      {"docType":"10",
      "docTypeDesc":"Indonesian ID"},
      {"docType":"20",
      "docTypeDesc":"Passport No – Local"},
      {"docType":"21",
      "docTypeDesc":"Passport No – Foreign"},
      { "docType":"22",
      "docTypeDesc":"Birth Certificate"},
    {"docType":"23",
      "docTypeDesc":"Driving Licence No"},
      {"docType":"24",
      "docTypeDesc":"Social Security System ID"},
        {"docType":"25",
      "docTypeDesc":"Government Service ID"},
          {"docType":"26",
      "docTypeDesc":"Tax ID"},
            {"docType":"27",
      "docTypeDesc":"Travel Document"},
              {"docType":"28",
      "docTypeDesc":"Tax ID – Foreign Incorporated Company"},
                {"docType":"29",
      "docTypeDesc":"Residency Certificate"},
                  {"docType":"30",
      "docTypeDesc":"Election ID"},
                    {"docType":"31",
      "docTypeDesc":"Photo ration ID"},
                      {"docType":"32",
      "docTypeDesc":"Military ID – Officer"},
                        {"docType":"33",
      "docTypeDesc":"Military ID – Non-Officer"},
                          {"docType":"34",
      "docTypeDesc":"Police ID"},
                            {"docType":"35",
      "docTypeDesc":"Diplomat ID"},
                              {"docType":"36",
      "docTypeDesc":"Work Permit"},
                                {"docType":"51",
      "docTypeDesc":"Business Registration No"},
                                  {"docType":"52",
      "docTypeDesc":"Government / Statutory Board / School"},
                                    {"docType":"53",
      "docTypeDesc":"Association / Club / Society"},
                                      {"docType":"54",
      "docTypeDesc":"Sole Proprietorship / Partnership"},
                                        {"docType":"55",
      "docTypeDesc":"Financial Institution"},
                                          {"docType":"56",
      "docTypeDesc":"Charity / Trust"},
                                            {"docType":"60",
      "docTypeDesc":"Certificate of Incorporation – Local"},
                                              {"docType":"61",
      "docTypeDesc":"Certificate of Incorporation – Foreign"},
                                                {"docType":"62",
      "docTypeDesc":"Credit Bureau ID"},
                                                  {"docType":"63",
      "docTypeDesc":"Business License"},
                                                    {"docType":"64",
      "docTypeDesc":"Tax ID –  Individual without Social Security No (US Only)"},
                                                      {"docType":"65",
      "docTypeDesc":"Tax ID –  Temporary "},
                                                        {"docType":"66",
      "docTypeDesc":"Tax ID –  Preparer"},
                                                          {"docType":"67",
      "docTypeDesc":"India ID – Aadhaar Number"},
                                                            {"docType":"97",
      "docTypeDesc":"Control Account"},
                                                              {"docType":"98",
      "docTypeDesc":"Internal Generated No"},
                                                                {"docType":"99",
      "docTypeDesc":"Miscellaneous"}

    ];

    var educationLevelList= [{
      "educationLevel": "01",
      "educationLevelDesc" : "University"
    },
      {
        "educationLevel": "02",
        "educationLevelDesc" : "Diploma"
      },
      {
        "educationLevel": "03",
        "educationLevelDesc" : "Pre-University"
      },
      {
        "educationLevel": "04",
        "educationLevelDesc" : "Secondary"
      },
      {
        "educationLevel": "05",
        "educationLevelDesc" : "Primary"
      },
      {
        "educationLevel": "09",
        "educationLevelDesc" : "Others"
      }];

    var phoneTypeList= [{
      "phoneType": "01",
      "phoneTypeDesc" : "Home"
    },
      {
        "phoneType": "02",
        "phoneTypeDesc" : "Office"
      },
      {
        "phoneType": "03",
        "phoneTypeDesc" : "Pager"
      },
      {
        "phoneType": "04",
        "phoneTypeDesc" : "Mobile"
      },
      {
        "phoneType": "05",
        "phoneTypeDesc" : "Fax"
      },
      {
        "phoneType": "06",
        "phoneTypeDesc" : "Others"
      }];

  return {

    getNationalityList: function() {

      return nationalityData;
    },
    getRaceList: function() {

      return raceData;
    },
    getCountryList: function() {

      return countriesData;
    },
    getDocType: function() {

      return documentType;
    },

    getEducationLevelList: function() {

      return educationLevelList;
    },
    getPhoneTypeList: function() {

      return phoneTypeList;
    }

  };

})
  .factory('BranchLocater', function($http, $q, $timeout){
    var branchList=[{
      "country": "Singapore",
      "branchId": "",
      "language": "EN",
      "type": "WCAPOSB",
      "name": "Zhenghua Branch",
      "address": "1 Segar Road #01-06 Zhenghua Community Club",
      "postal_code": "Singapore 677738",
      "tel": "",
      "fax": "",
      "latitude": 1.38657,
      "longitude": 103.7718,
      "operatingHours": "Business Hours:<br>Mon - Fri: 8.30 AM - 4.30 PM<br>Sat: 8.30 AM - 1.00 PM<br><br>All cash transactions must be made at ATM and CAM.",
      "SMSQ": "",
      "QCAMURL": ""
    },
      {
        "country": "Singapore",
        "branchId": "ABM 001",
        "language": "EN",
        "type": "ABM",
        "name": "DBS Sports Hub Branch 1",
        "address": "1 Stadium Place #06/07",
        "postal_code": "Singapore 397628",
        "tel": "",
        "fax": "",
        "latitude": 1.30333,
        "longitude": 103.87302,
        "operatingHours": "",
        "SMSQ": "",
        "QCAMURL": ""
      },
      {
        "country": "Singapore",
        "branchId": "",
        "language": "EN",
        "type": "ATM",
        "name": "112 Katong",
        "address": "112 East Coast Road Basement",
        "postal_code": "Singapore 428802",
        "tel": "",
        "fax": "",
        "latitude": 1.30551,
        "longitude": 103.90462,
        "operatingHours": "",
        "SMSQ": "",
        "QCAMURL": ""
      }];
    return{
      getAllBranches: function () {

        var defer= $q.defer();

        $http.get('mock/allBranches.json').then(function (response) {

          defer.resolve(response.data);

        },function (response) {

          defer.reject(response);

        });

        return defer.promise;
      },


      getAllBranchesURL: function () {

        var defer= $q.defer();

        var req = {
          method: 'GET',
          url: 'https://dbs-developers.com:10443/api/sg/v1/locator/branchLocations/'
        }

        $http(req).then(function(response){
          defer.resolve(response.data);
        }, function(response){
          defer.reject(response);
        });

        return defer.promise;
      }
    };

  })
  .factory('NewUserRequestTemplate', function($q){

    var template= {
    "parties":{
      "commonDetl":{
        "trailDetl":{
          "operatorId":"PWCB",
          "operatorDateTime":"2016-06-16T17:58:20.445+08:00",
          "operatorMainUnit":"0352",
          "authorizerId":"PWCB"
        }
      },
      "partyDoc":{
        "item":[
          {
            "isPrimaryDoc":"true",
            "docType":"01",
            "docTypeDesc":"Singapore ID",
            "docNumber":"P9898097868",
            "docIssuePlace":"singapore",
            "docIssueCtry":"SGP",
            "docIssueDate":"1999-08-13",
            "docExpiryDate":"2999-08-13"
          },
          {
            "isPrimaryDoc":"false",
            "docType":"06",
            "docNumber":"123456789"
          }
        ]
      },
      "partyInternalId":{
        "CISInternalId":{
          "CISCIN":"S1014979G"
        }
      },
      "partyDetl":{
        "partyRetail":{
          "partyName":{
            "fullName":"",
            "name":{
              "firstName":"New User",
              "middleName":"",
              "lastName":"Soh"
            },
            "nameSuffix":"AHM",
            "salutation":"Mr",
            "alias":"JOE AH KOW",
            "localFullName":"",
            "localAlias":""
          },
          "partyType":"R",
          "partyEntityType":"CUSTOMER",
          "birthDate":"1970-08-20",
          "gender":"M",
          "nationality":"356",
          "nationalityDesc":"Singapore",
          "residenceCity":"356",
          "residenceCtry":"356",
          "residenceCtryDesc":"singapore",
          "race":"1",
          "raceDesc":"Chinese",
          "maritalStatus":"02",
          "maritalStatusDesc":"Married",
          "educationLevel":"06",
          "isResident":"true",
          "nonResidentDate":"2015-02-21",
          "maidenName":"a",
          "motherMaidenName":"ONG SIEW LIAN",
          "isGSTResident":"true"
        }
      },
      "contacts":{
        "phoneDetl":{
          "item":[
            {
              "phone":{
                "phoneType":"01",
                "phoneCtryCode":"65",
                "phoneAreaCode":"65",
                "phoneNumber":"912348888",
                "phoneExtnsion":"4098",
                "effectiveDate":"2015-02-22",
                "expiryDate":"2025-02-22"
              },
              "contactName":"JOHN MICH CHAN",
              "isPrefPhone":"true",
              "phoneUsage":"OFF",
              "isDoNotSpam":"true",
              "lastUpdMainUnit":"0087",
              "lastUpdId":"CBTKtR",
              "unformatPhoneNumber":"91234098"
            }
          ]
        },
        "partyAddressDetl":{
          "item":[
            {
              "addressInternalId":"HOM",
              "addressType":"MAIL",
              "partyAddress":{
                "addressLine1":"STREET",
                "addressLine2":"STREET",
                "addressLine3":"STREET",
                "addressLine4":"",
                "addressLine5":"STREET",
                "block":"78",
                "level":"09",
                "unit":"100",
                "postalCode":"190399",
                "estate":"Guangdong Estate",
                "city":"Guangdong Estate",
                "district":"Guangdong Estate",
                "stateProvince":"Guangdong",
                "ctry":"356",
                "ctryDesc":"singapore"
              },
              "effectiveDate":"2014-02-22",
              "expiryDate":"2015-02-22",
              "lastUpdMainUnit":"0321",
              "lastUpdId":"CBOONG",
              "isPrefAddress":"true",
              "holdMailDetl":{
                "lastUpdDate":"2015-02-22",
                "lastUpdMainUnit":"0399"
              },
              "altPartyAddressDetl":{
                "altAddressLanguage":{
                  "languageType":"Chinese",
                  "ctryOfLanguage":"156"
                },
                "altAddress":{
                  "addressLine1":"STREET1",
                  "addressLine2":"STREET2",
                  "addressLine3":"STREET3",
                  "addressLine4":"",
                  "addressLine5":"STREET5",
                  "building":"Beatiful Mansion",
                  "block":"888",
                  "level":"09",
                  "unit":"366",
                  "postalCode":"253888",
                  "estate":"Tiong Bahru Estate",
                  "city":"Singapore",
                  "district":"Singapore",
                  "stateProvince":"Singapore",
                  "ctry":"356",
                  "ctryDesc":"Singapore"
                }
              }
            }
          ]
        }
      },
      "partyClassification":{
        "partySegment":"03",
        "partyOwnerDetl":{
          "item":{
            "partyOwner":"0003",
            "partyOwnerDesc":"Private Banking",
            "partySegmentDetl":{
              "segmentLevel1":"L1",
              "segmentLevel1Desc":"Level 1",
              "segmentLevel2":"STY1",
              "segmentLevel2Desc":"STY1 Description",
              "segmentLevel3":"SEGN01",
              "segmentLevel3Desc":"Segment 01",
              "segmentLevel4":"SEGLVL4",
              "segmentLevel4Desc":"Segment Level 4 Desc"
            },
            "officerDetl":{
              "item":[
                {
                  "officerType":"P",
                  "officerId":"CPTMLEK",
                  "officerName":"Robert Strongman",
                  "officerUnit":"0411",
                  "officerContact":"98766322"
                }
              ]
            },
            "relationshipStartDate":"2015-02-22T09:30:47+08:00"
          }
        }
      },
      "partyRiskScoreDetl":{
        "partyRiskScore":"AAA",
        "riskScoreDateTime":"2016-02-22T19:00:03+08:00",
        "partyRiskMemo":"Risk Memo",
        "effectiveDateTime":"2016-02-22T19:00:03+08:00",
        "expiryDateTime":"2016-02-22T19:00:03+08:00",
        "partyRiskLevel":"03",
        "riskLevelDateTime":"2016-02-22T19:00:03+08:00",
        "nextReviewDateTime":"2016-02-22T19:00:03+08:00",
        "lastUpdDate":"2015-02-22",
        "lastUpdTime":"19:00:03",
        "lastUpdMainUnit":"0981",
        "lastUpdId":"CPLKBB"
      },
      "taxRelated":{
        "taxDetl":{
          "item":{
            "taxResidenceCtry":"840",
            "taxType":"FATCA",
            "taxFormType":"BN23F",
            "taxFormDate":"2015-02-22",
            "taxCategory":"YES",
            "taxCategoryUpdDateTime":"2016-02-22T19:00:03+08:00",
            "taxReviewStatus":"001",
            "taxReviewStatusUpdDateTime":"2016-02-22T19:00:03+08:00",
            "globalTaxId":"IRS12348937",
            "lastUpdDate":"2015-02-22",
            "lastUpdTime":"08:30:47",
            "lastUpdMainUnit":"CBTNTTK",
            "lastUpdId":"0411"
          }
        },
        "isUSTaxApproved":"true",
        "USTaxApprovalDate":"2015-02-22"
      }
    }
  };
  return {
    getTemplate: function () {

      var defer = $q.defer();

      defer.resolve(template);

      return defer.promise;
    }
  };
})
  .factory('Appointments', function($http, $q, $timeout){
    var availableAppointments=[];
    return{

      randomFutureDateGeneratorBecauseIDontHaveRealData: function(){

        var now= new Date();
        var laterDate= new Date()
        laterDate.setTime( now.getTime() + Math.floor(Math.random() * 1000000000) );

        var day= laterDate.getDate();
        var month= laterDate.getMonth() + 1;
        var year= laterDate.getFullYear();

        var slotDate= day + '-' + month + '-' + year;

        var randomNo= Math.floor(Math.random() * 4)
        var slotTime= '';

        switch(randomNo){
          case 0:
            slotTime= "Early Morning(8am to 10am) GMT+8";
            break;
          case 1:
            slotTime= "Morning(9am to 12pm) GMT+8";
            break;
          case 2:
            slotTime= "Lunch(12pm to 2pm) GMT+8";
            break;
          case 3:
            slotTime= "Afternoon(2pm to 6pm) GMT+8";
            break;
          default:
            break;
        };

        return{
          slotDate: slotDate,
          slotTime: slotTime
        };
      },

      generateRandomDateData: function () {

        var data= {
          apptslots: []
        };

        for(var i = 0; i< 500; i++){
          data.apptslots[i]= this.randomFutureDateGeneratorBecauseIDontHaveRealData();
        }

        console.log("random generated Appointments", data);

        return data;
      },

      getAllAppointmentsMock: function () {

        var defer= $q.defer();

        $http.get('mock/availableAppointments.json').then(function (response) {

          defer.resolve(response.data);

        },function (response) {

          defer.reject(response);

        });

        return defer.promise;
      },

      getAllAppointmentsMockData: function (apiKey, uuid, accessToken, branchID) {
        var defer= $q.defer();

        defer.resolve(this.generateRandomDateData());

        return defer.promise;
      },


      getAllAppointments: function (apiKey, uuid, accessToken, branchID) {

        var defer= $q.defer();

        var req = {
          method: 'GET',
          url: 'https://dbs-developers.com:10443/api/sg/v1/appointments/slots/',
          headers: {
            'Content-Type'  : 'application/json',
            'Authorization' :  accessToken,
            'uuid'          :  uuid,
            'apiKey'        :  apiKey,
            'branchID'       : branchID
          }
        }

        $http(req).then(function(response){
          defer.resolve(response.data);
        }, function(response){
          defer.reject(response);
        });

        return defer.promise;
      },

      requestAppointment: function (apiKey, uuid, accessToken, userReq) {

        var defer= $q.defer();

        var req = {
          method: 'POST',
          url: 'https://dbs-developers.com:10443/api/sg/v1/appointments/makeappt/',
          headers: {
            'Content-Type': 'application/json',
            'apiKey':  apiKey,
            'uuid'  : uuid,
            'Authorization': accessToken
          },
          data: userReq
        }

        $http(req).then(function(response){
          defer.resolve(response.data);
        }, function(response){
          defer.reject(response);
        });

        return defer.promise;
      }


    };

  })
  .factory('NotificationManager', function($http, $q, $timeout){

    return {

      sendSMSNotification: function (toNumber) {

        var defer= $q.defer();

        var req = {
          method: 'POST',
          url: 'http://127.0.0.1:3001/api/sendMessage?to=' + toNumber
        }

        $http(req).then(function(response){
          defer.resolve(response.data);
        }, function(response){
          defer.reject(response);
        });

        return defer.promise;

      }
    }

  })
  .factory('OAuth', function($ionicPlatform, $http, $q, $timeout){

  return {

    signInWithiBanking: function (toNumber) {

      var defer= $q.defer();

      /*var req = {
        method: 'POST',
        url: 'http://127.0.0.1:3001/api/sendMessage?to=' + toNumber
      }

      $http(req).then(function(response){
        defer.resolve(response.data);
      }, function(response){
        defer.reject(response);
      });*/

      return defer.promise;

    }
  }

});

