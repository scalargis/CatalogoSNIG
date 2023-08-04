# CatologoSNIG

O CatalogoSNIG permite adicionar aos visualizadores da plataforma ScalarGIS funcionalidades de pesquisa e exploração do catálogo de metadados do Sistema Nacional de Informação Geográfica (SNIG).

É um componente de *frontend* do ScalarGIS ([scalargis-client](https://github.com/scalargis/scalargis-client)) e   pode ser adicionado a qualquer visualizador. Configurado por defeito para pesquisar e explorar o [catálogo de metadados do SNIG](https://snig.dgterritorio.gov.pt/rndg), suporta também a integração com qualquer catálogo de metadados baseado em [GeoNetwork 3.x](https://geonetwork-opensource.org/manuals/3.12.x/en/index.html).

# Instalação

O CatalogoSNIG é um componente de *[frontend](https://github.com/scalargis/scalargis-client)* do ScalarGIS. A sua instalação é feita através da integração da diretoria raiz do seu repositório na diretoria `/packages/viewer/src/components` da projeto scalargis-client. A diretoria `/packages/viewer/src/components` é utilizada para incluir componentes que adicionam novas funcionalidades ao *frontend* do ScalarGIS, permitindo depois que possam ser utilizadas nos visualizadores.

A integração de novos componentes poderá ser feita através de um *clone* do projeto do componente para dentro da diretoria `/packages/viewer/src/components` do scalargis-client. No caso do **CatlalogoSNIG**, seria realizado da seguinte forma:

```
cd scalargis/scalargis-client/packages/viewer/src/components
git clone https://github.com/scalargis/CatalogoSNIG.git
```

A operação anterior resulta na criação da seguinte diretoria:
`/packages/viewer/src/components/CatalogoSNIG`

Depois realizada a clonagem do projeto, será necessário fazer novo *build* do viewer do ScalarGIS e *deploy* no scalargis-server:

```
cd scalargis/scalargis-client
yarn deploy-server:viewer
```

# Funcionalidades

Quando integrado num visualizador disponbibilizado pela plataforma ScalarGIS, o componente CatalogSNIG permite, sem qualquer configuração adicional, a pesquisa e exploração do catálogo de metadados do [Sistema Nacional de Informação Geográfica](https://snig.dgterritorio.gov.pt) (SNIG).

O componente CatalogoSNIG recria as funcionalidades de pesquisa do Registo Nacional de Dados Geográficos (RNDG) que são disponibilizadas pelo portal do [SNIG](https://snig.dgterritorio.gov.pt/rndg):

![Alt text](https://user-images.githubusercontent.com/73700749/258099038-64777852-fe9e-40d3-a860-3748623e2780.png "Página de pesquisa do Registo Nacional de Dados Geográficos")

Para além das pesquisas através dos filtros *"O Quê?"* e *"Onde?"*, são também disponibilizadas ferramentas para:

* refinar a pesquisa através da aplicação de outros filtros aos resultados que vão sendo obtidos
* consultar as fichas de metadados associadas a cada registo
* consultar e explorar os serviços geográficos associados a cada registo, caso se aplique
* adicionar ao mapa do visualizador um ou mais temas disponibilizados pelos serviços geográficos associados a um registo de metadados

O ecrã inicial do componente é apresentado conforme a seguinte imagem:

![Alt text](https://user-images.githubusercontent.com/73700749/258098996-b1a3d2fd-e2e5-4608-ac39-8b59dc898273.png "Ecrã de inicial do componente CatalogoSNIG")

As caixas de texto dos filtros *"O Quê?"* e *"Onde?"* apresentam sugestões à medida que o utilizador vai introduzindo o texto a pesquisar:

![Alt text](https://user-images.githubusercontent.com/73700749/258139974-21262e1b-1c1a-4861-8306-a743719c1087.png "Filtros O Quê? e Onde?")

A pesquisa é executada através do botão *Pesquisar*, sendo apresentados dois paineis após a sua execução, um com os resultados agregados por classificador e outro com todos os registos devolvidos pela pesquisa.

![Alt text](https://user-images.githubusercontent.com/73700749/258098998-79d7dc3e-4202-4360-b339-0923dd6e9ecb.png "Filtro com os resultados agregados por classificador")

Através dos resultados agregados por classfificador é possível refinar a pesquisa que foi realizada, permitindo que o utilizador possa acrescentar mais filtros de forma interativa.

![Alt text](https://user-images.githubusercontent.com/73700749/258099001-d8f9e68d-2bd4-4b58-af26-4ff1fd213e47.png "Painel de Resultados")

O botão "*+ Mapa*" é apresentado quando o registo de metadados tem um serviço geográfico associado (WMS, WMTS ou WFS), permitindo através dele explorar esse serviço geográfico e adicionar ao mapa do visualizador um ou mais dos seus temas.

![Alt text](https://user-images.githubusercontent.com/73700749/258099012-de48567e-91fa-4cde-ba1f-3ada920da961.png "Adicionar temas dos serviço geográfico")

O tema ou temas selecionados são adicionados ao mapa, passando a constar na tabela de conteúdos, sendo assim possível configurar posteriormente a sua visibilidade e outras propriedades.

![Alt text](https://user-images.githubusercontent.com/73700749/258099018-0c3a47e4-b2aa-4a04-8975-008d979df20f.png "Adicionar temas dos serviço geográfico")

## Outros filtros

Apesar do componente estar orientado por defeito para pesquisar e explorar o catálogo do SNIG, é possível configurá-lo de forma a permitir a sua integração com qualquer outro catálogo baseado na versão 3.x do GeoNetwork. A configuração do componente permite definir os atributos de pesquisa (filtros) mais adaptados a determinado catálogo. A seguinte imagem apresenta o componente configurado para aceder ao catálogo de metadados da [Infraestrtutura de Dados Espaciais Interativa dos Açores](https://sma.idea.azores.gov.pt/geonetwork) (IDEiA):

![Alt text](https://user-images.githubusercontent.com/73700749/258099024-b7db449f-36e9-4148-aeee-90d5fefc2bb8.png "Exemplo de alteração dos atributos de pesquisa")

## Múltiplos catálogos

Este componente também poderá ser configurado de forma a permitir a pesquisa em relação a vários catálogos. Utilizando este tipo de configuração, no topo do ecrã é apresentada uma caixa de seleção com a lista de catálogos de metadados disponíveis para pesquisa. Cada um destes catálogos pode ser configurado com diferentes atributos de pesquisa.

![Alt text](https://user-images.githubusercontent.com/73700749/258098994-0540eea7-4a6f-4f4e-ac51-8879c102d8ea.png "Componente configurado para pesquisa a múltiplos catálogos")

# Configuração

A configuração do componente CatalogoSNIG num visualizador faz-se de forma semlhante à dos outros componentes de *frontend* do ScalarGIS. A seguinte configuração é suficiente para permitir a pesquisa ao catálogo do SNIG:

```
{
  "id": "catalogosnig",
  "type": "CatalogoSNIG",
  "title": "Catálogo SNIG",
  "icon": "pi pi-briefcase",
  "target": "mainmenu",
  "config_json": {
    "url": "https://snig.dgterritorio.gov.pt/rndg"
  },
  "children": []
}
```

Como se pode verificar pelo exemplo anterior, o componente foi desenvolvido de forma a simplificar o mais possível a integração com o catálogo do SNIG. Caso se pretenda integrar com outro catálogo de metadados (com a limitação de ter que ser baseado em GeoNetwork 3.x),  existem diversos parâmetros que permitem ajustar o componente às características do catálogo a integrar  ou simplesmente para alterar o modo como é realizada a pesquisa ou são apresentados os resultados. Na configuração que se apresenta em seguida constam alguns dos parâmetros que permitem ajustar o comportamento do componente:

```
{
  "id": "catalogoidea",
  "type": "CatalogoSNIG",
  "title": "Catálogo IDEiA",
  "icon": "pi pi-briefcase",
  "target": "mainmenu",
  "config_json": {
    "classname": "metadata-catalog",
    "description": "A IDEiA – Infraestrutura de Dados Espaciais Interativa dos Açores constitui um projeto na área dos Sistemas de Informação Geográfica - SIG, que tem como principal objetivo o desenvolvimento e a gestão de uma infraestrutura de dados geográficos (IDE – Infraestrutura de Dados Espaciais) de referência para a Região Açores",
    "content_header": {
      "html": "<a href='http://www.ideia.azores.gov.pt/' target='_blank'><img style='width: 50%'' src='http://www.ideia.azores.gov.pt/Style%20Library/css/img/Logo_IDEiA.png' /></a>"
    },
    "url": "https://sma.idea.azores.gov.pt/geonetwork",
    "search_action": "searchCatalog",
    "sortOptions": [
      {
        "value": "relevance",
        "label": "Relevância"
      },
      {
        "value": "title",
        "label": "Título"
      }
    ],
    "sortBy": "relevance",
    "float_labels": true,
    "filters": [
      {
        "id": "what",
        "type": "Any",
        "label": "O quê?",
        "query": "anylight",
        "options": {
          "multi": true,
          "forceSelection": false,
          "suggest": {
            "path": "/srv/por/suggest",
            "field": "anylight",
            "sortBy": "STARTSWITHFIRST",
            "filterField": "",
            "filterValue": ""
          }
        }
      },
      {
        "id": "keyword",
        "type": "List",
        "label": "Palavra-chave?",
        "query": "keyword",
        "options": {
          "multi": true,
          "forceSelection": true,
          "mode": "any",
          "source": {
            "type": "suggests",
            "path": "/srv/por/suggest",
            "field": "keyword",
            "sortBy": "STARTSWITHFIRST"
          }
        }
      },
      {
        "id": "orgname",
        "type": "List",
        "label": "Entidade Responsável",
        "query": "orgName",
        "options": {
          "multi": true,
          "forceSelection": true,
          "mode": "any",
          "source": {
            "type": "suggests",
            "path": "/srv/por/suggest",
            "field": "orgName",
            "sortBy": "STARTSWITHFIRST"
          }
        }
      },
      {
        "id": "topic",
        "type": "Tags",
        "label": "Tópicos",
        "query": "_cat",
        "options": {
          "multi": true,
          "forceSelection": true,
          "mode": "any",
          "field": "code",
          "source": {
            "path": "/srv/api/0.1/tags",
            "lang": "por"
          }
        }
      },
      {
        "id": "resource_date",
        "type": "DateRange",
        "label": "Criação do Recurso",
        "query": [
          "creationDateFrom",
          "creationDateTo"
        ]
      },
      {
        "id": "metadata_date",
        "type": "DateRange",
        "label": "Criação dos Metadados",
        "query": [
          "dateFrom",
          "dateTo"
        ]
      }
    ],
    "summary": {
      "use_default": false,
      "maxDimensions": 5,
      "strings": {
        "type": "Tipos de Recursos",
        "topicCat": "Tópicos",
        "keyword": "Palavras-chave",
        "service-view": "Visualização",
        "service-download": "Descarregamento",
        "service-discovery": "Pesquisa",
        "service-transformation": "Processamento"
      }
    },
    "allow_add_map": true,
    "allow_service_types": [
      "WMS",
      "WMTS"
    ]
  },
  "children": []
}
```

A utilização de múltiplos catálogos pode ser realizada através da seguinte configuração:

```
{
  "id": "catalogossnig",
  "type": "CatalogoSNIG",
  "title": "Catálogos",
  "icon": "pi pi-briefcase",
  "target": "mainmenu",
  "config_json": {
    "classname": "metadata-catalog",
    "show_content_header": true,
    "catalogs": {
      "url": "https://raw.githubusercontent.com/scalargis/CatalogoSNIG/main/examples/catalogos.json"
    }
  },
  "children": []
}
```

Como pode ser verificado no exemplo anterior, a definição dos catálogos a utilizar pode ser realizada num ficheiro externo, sendo a localização desse ficheiro especificada através da propriedade `config_json.catalogs.url`. O seguinte código mostra o possível conteúdo de uma ficheiro de configuração de catálogos ([ver exemplo mais completo](https://github.com/scalargis/CatalogoSNIG/blob/main/examples/catalogos.json)):

```
[
  {
    "id": "catalogosnig",
    "title": "Catálogo SNIG",
    "config_url": "https://raw.githubusercontent.com/scalargis/CatalogoSNIG/main/examples/snig.json",
    "help": {
      "as": "external",
      "url": "https://snig.dgterritorio.gov.pt/rndg"
    }
  }, 
  {
    "id": "catalogsnig_opendata",
    "title": "Catálogo SNIG - Dados Abertos",
    "config_url": "https://raw.githubusercontent.com/scalargis/CatalogoSNIG/main/examples/snig_opendata.json",
    "help": {
      "as": "popup",
      "html": "<div>O Sistema Nacional de Informação Geográfica é uma infraestrutura colaborativa que permite partilhar, pesquisar e aceder a informação geográfica através do Registo Nacional de Dados Geográficos</div>"
    }
  }  
]
```

A configuração de cada catálogo também pode ser realizada através de um ficheiro externo, cuja localização é definida na propriedade `config_url`. Diversos exemplos de configuração de catálogos podem ser consultados em:
[https://github.com/scalargis/CatalogoSNIG/tree/main/examples](https://github.com/scalargis/CatalogoSNIG/tree/main/examples).

