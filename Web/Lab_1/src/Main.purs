module Main where

import Prelude

import Data.Array as Array
import Data.Array (filter,length, mapMaybe, nub, cons)
import Data.String (length) as String
import Data.Either (Either(..))
import Data.Traversable (for_, traverse_)
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Number (fromString)
import Effect (Effect)
import Data.Nullable (Nullable, toMaybe)
import Effect.Class (liftEffect)
import Effect.Console (log)
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Aff (Aff, launchAff_, attempt)
import Web.DOM.Document (Document, toParentNode)
import Web.HTML.HTMLInputElement (checked, fromElement, value)
import Web.DOM.Element (fromNode, getAttribute, setAttribute, toEventTarget, toNode)
import Web.DOM.Node (Node)
import Web.DOM.NonElementParentNode (getElementById)
import Web.DOM.ParentNode (QuerySelector(..), querySelectorAll)
import Web.Event.Event (EventType(..))
import Web.Event.EventTarget (addEventListener, eventListener)
import Web.HTML (window)
import Web.HTML.Window (document)
import Web.HTML.HTMLDocument as HTMLDocument
import Web.DOM.NodeList (toArray) as NodeList
import Web.Event.Internal.Types (Event)

type AppState =
  { x :: Number
  , y :: Maybe Number
  , r :: Array Number
  }

type ValidState =
  { x :: Number
  , y :: Number
  , r :: Array Number
  }

type ResultEntry =
  { x :: Number
  , y :: Number
  , r :: Number
  , result :: Boolean
  , time :: String
  , execTime :: String
  }
main :: Effect Unit
main = do
  htmlDoc <- document =<< window
  let doc = HTMLDocument.toDocument htmlDoc
  appStateRef <- Ref.new { x: 0.0, y: Nothing, r: [] }
  restoreHistory
  initXInput appStateRef
  initYButtons appStateRef doc
  initRCheckboxes appStateRef doc
  initFormSubmit appStateRef
  log "Инициализация PureScript завершена."

initXInput :: Ref AppState -> Effect Unit
initXInput appStateRef = do
  htmlDoc <- document =<< window
  maybeElement <- getElementById "x" (HTMLDocument.toNonElementParentNode htmlDoc)
  case maybeElement of
    Nothing -> log "x input not found"
    Just element -> do
      let maybeHtmlInput = fromElement element
      case maybeHtmlInput of
        Nothing -> log "x is not input"
        Just htmlInput -> do
          listener <- eventListener \_ -> do
            val <- value htmlInput
            let parsed = fromMaybe 0.0 (parseNumber val)
            Ref.modify_ (_ { x = parsed }) appStateRef
          void $ addEventListener (EventType "input") listener false (toEventTarget element)

initYButtons :: Ref AppState -> Document -> Effect Unit
initYButtons appStateRef doc = do
  nodeList <- querySelectorAll (QuerySelector ".y-btn") (toParentNode doc)
  nodes <- NodeList.toArray nodeList
  let buttons = mapMaybe fromNode nodes
  log $ "Найдено кнопок Y: " <> show (length buttons)

  traverse_ (\btnElement -> do
    listener <- eventListener \_ -> do
      allButtons <- querySelectorAll (QuerySelector ".y-btn") (toParentNode doc)
      allButtonsNodes <- NodeList.toArray allButtons
      let allButtonsElements = mapMaybe fromNode allButtonsNodes
      traverse_ (\b -> do
        setAttribute "style" "" b
        setAttribute "active" "false" b
      ) allButtonsElements

      setAttribute "style" "background-color: #3498db; color: white;" btnElement
      setAttribute "active" "true" btnElement

      maybeVal <- getAttribute "data-value" btnElement
      case maybeVal >>= parseNumber of
        Nothing -> do
          btnText <- textContent (toNode btnElement)
          case parseNumber btnText of
            Nothing -> log $ "Не удалось распознать значение Y: " <> btnText
            Just yNum -> do
              Ref.modify_ (_ { y = Just yNum }) appStateRef
              log $ "Selected Y = " <> show yNum
        Just yNum -> do
          Ref.modify_ (_ { y = Just yNum }) appStateRef
          log $ "Selected Y = " <> show yNum
    void $ addEventListener (EventType "click") listener false (toEventTarget btnElement)
  ) buttons

initRCheckboxes :: Ref AppState -> Document -> Effect Unit
initRCheckboxes appStateRef doc = do
  nodeList <- querySelectorAll (QuerySelector "input[name=\"r\"]") (toParentNode doc)
  nodes <- NodeList.toArray nodeList
  let checkboxes = mapMaybe fromNode nodes
  log $ "Найдено чекбоксов R: " <> show (length checkboxes)

  traverse_ (\cbElement -> do
    let maybeHtmlInput = fromElement cbElement
    case maybeHtmlInput of
      Nothing -> pure unit
      Just htmlInput -> do
        listener <- eventListener \_ -> do
          isChecked <- checked htmlInput
          maybeVal <- getAttribute "value" cbElement
          case maybeVal >>= parseNumber of
            Nothing -> pure unit
            Just rVal -> do
              Ref.modify_ (\st ->
                let newR = if isChecked
                           then nub (st.r <> [rVal])
                           else filter (_ /= rVal) st.r
                in st { r = newR }
              ) appStateRef
        void $ addEventListener (EventType "change") listener false (toEventTarget cbElement)
  ) checkboxes

saveResult :: ResultEntry -> Effect Unit
saveResult result = do
  current <- getItem "results"
  let currentArray = case toMaybe current of
        Nothing -> []
        Just json -> fromMaybe [] (parseResults json)
      newArray = cons result currentArray
  setItem "results" (stringify newArray)
  log "💾 Результат сохранен в localStorage"

restoreHistory :: Effect Unit
restoreHistory = do
  log "PureScript: Восстанавливаем историю..."
  resultsJson <- getItem "results"
  case toMaybe resultsJson of
    Nothing -> log "История не найдена"
    Just json -> do
      log $ "Получены данные из localStorage, длина: " <> show (String.length json) <> " chars"
      safeRestoreHistory json

safeRestoreHistory :: String -> Effect Unit
safeRestoreHistory json = do
  count <- safeParseAndDisplay json
  if count > 0 then
    log $ "Безопасно восстановлено " <> show count <> " записей"
  else
    log "Не удалось восстановить историю"


initFormSubmit :: Ref AppState -> Effect Unit
initFormSubmit appStateRef = do
  htmlDoc <- document =<< window
  maybeForm <- getElementById "point-form" (HTMLDocument.toNonElementParentNode htmlDoc)
  case maybeForm of
    Nothing -> log "Form not found"
    Just form -> do
      listener <- eventListener \e -> do
        preventDefault e
        state <- Ref.read appStateRef
        log $ "Состояние перед валидацией: " <> show state

        case validateState state of
          Left err -> do
            log $ "Ошибка валидации: " <> err
            alert err
          Right validState -> do
            log $ "Валидное состояние: " <> show validState

            for_ validState.r \rVal -> do
              processRequestJS validState.x validState.y rVal
              log $ "Вызван processRequestJS с R=" <> show rVal
      void $ addEventListener (EventType "submit") listener false (toEventTarget form)




validateState :: AppState -> Either String ValidState
validateState state = do
  if state.x < -5.0 || state.x > 3.0
    then Left "X должен быть в диапазоне от -5 до 3"
    else pure unit

  y <- case state.y of
    Just value -> Right value
    Nothing -> Left "Выберите значение Y"

  if state.r == []
    then Left "Выберите хотя бы одно значение R"
    else pure unit

  Right { x: state.x, y, r: state.r }

parseNumber :: String -> Maybe Number
parseNumber str = fromString str

textContent :: Node -> Effect String
textContent node = do
  content <- _textContent node
  pure $ fromMaybe "" content

foreign import alert :: String -> Effect Unit
foreign import preventDefault :: Event -> Effect Unit
foreign import _textContent :: Node -> Effect (Maybe String)
foreign import processRequestJS :: Number -> Number -> Number -> Effect Unit
foreign import displayResultInTable :: Number -> Number -> Number -> Boolean -> String -> String -> Effect Unit
foreign import processRequestWithResult :: Number -> Number -> Number -> Aff { x :: Number, y :: Number, r :: Number, result :: Boolean, time :: String, execTime :: String }
foreign import getItem :: String -> Effect (Nullable String)
foreign import setItem :: String -> String -> Effect Unit
foreign import clearStorage :: Effect Unit
foreign import parseResults :: String -> Maybe (Array ResultEntry)
foreign import stringify :: Array ResultEntry -> String
foreign import safeParseAndDisplay :: String -> Effect Int
