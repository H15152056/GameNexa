import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import './AdminPage.css'

import { gamesData } from '../data/gamesData'
import {
  applyCMSOverrides,
  cmsCollectionKey,
  cmsCollectionOverridesKey,
  cmsDeletedGuidesKey,
  cmsDescKey,
  cmsGameFieldsKey,
  cmsGuidesKey,
  cmsHeadingKey,
  cmsKey,
  cmsStructureKey,
  cmsTitleKey,
  fetchCMSContent,
  getStableRecordId,
  parseCMSCollection,
  parseCMSCollectionOverrides,
} from '../cms/cmsContent'

import {
  VIDEO_PREFIX,
  isVideoParagraph,
  getVideoUrlFromParagraph,
  toEmbedUrl,
} from '../utils/videoEmbed'

const COLLECTIONS = {
  genshin: [
    ['characters', 'Characters'],
    ['builds', 'Builds'],
    ['weapons', 'Weapons'],
    ['artifacts', 'Artifacts'],
    ['maps', 'Maps'],
    ['videos', 'Videos'],
  ],

  'whiteout-survival': [
    ['heroes', 'Heroes'],
    ['builds', 'Builds'],
    ['maps', 'Maps'],
    ['facilities', 'Facilities'],
    ['resources', 'Resources'],
    ['beartrap', 'Bear Trap'],
    ['videos', 'Videos'],
  ],
}

const EMPTY_GUIDE = {
  icon: '📖',
  title: '',
  desc: '',
  content: [
    {
      heading: 'Introduction',
      paragraphs: [
        'Write your guide content here.',
      ],
    },
  ],
}

function cloneGuide(guide) {
  return {
    icon: guide?.icon || '📖',
    title: guide?.title || '',
    desc: guide?.desc || '',
    content: Array.isArray(guide?.content)
      ? guide.content.map((section) => ({
          heading: section?.heading || '',
          paragraphs: Array.isArray(section?.paragraphs)
            ? [...section.paragraphs]
            : [],
        }))
      : [],
    cmsGuideId: guide?.cmsGuideId,
    cmsBuiltInGuideIndex:
      guide?.cmsBuiltInGuideIndex,
  }
}

function cloneObject(value) {
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return value
  }
}

function makeId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`
}

function getRecordId(item, index = 0) {
  return (
    item?._cmsSourceId ||
    item?.cmsRecordId ||
    item?.cmsId ||
    getStableRecordId(item, index)
  )
}

function getRecordLabel(item, index) {
  return (
    item?.name ||
    item?.title ||
    item?.slug ||
    `Record ${index + 1}`
  )
}

function getGameCollection(game, collection) {
  if (!game) {
    return []
  }

  if (
    game.slug === 'whiteout-survival' &&
    collection === 'heroes'
  ) {
    if (Array.isArray(game.heroes)) {
      return game.heroes
    }

    if (Array.isArray(game.characters)) {
      return game.characters
    }
  }

  if (Array.isArray(game[collection])) {
    return game[collection]
  }

  return []
}

function getEditableGameFields(game) {
  if (!game || typeof game !== 'object') {
    return {}
  }

  const fields = cloneObject(game) || {}

  delete fields.guides
  delete fields.characters
  delete fields.heroes

  delete fields._cmsGameFieldsOverridden

  return fields
}

function AdminPage() {
  const [authenticated, setAuthenticated] =
    useState(false)

  const [checkingSession, setCheckingSession] =
    useState(true)

  const [password, setPassword] =
    useState('')

  const [loginError, setLoginError] =
    useState('')

  const [content, setContent] =
    useState({})

  const [saving, setSaving] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [activeSection, setActiveSection] =
    useState('dashboard')

  const [selectedGame, setSelectedGame] =
    useState('genshin')

  const [selectedCollection, setSelectedCollection] =
    useState('characters')

  const [selectedItemId, setSelectedItemId] =
    useState('')

  const [collectionDraft, setCollectionDraft] =
    useState(null)

  const [collectionDraftText, setCollectionDraftText] =
    useState('')

  const [isCreatingItem, setIsCreatingItem] =
    useState(false)

  const [selectedGuide, setSelectedGuide] =
    useState(0)

  const [isCreatingGuide, setIsCreatingGuide] =
    useState(false)

  const [newGuide, setNewGuide] =
    useState(() => cloneGuide(EMPTY_GUIDE))

  const [editorDraft, setEditorDraft] =
    useState(null)

  const [gameDraftText, setGameDraftText] =
    useState('')

  const mergedGames = useMemo(
    () =>
      Object.values(
        applyCMSOverrides(
          gamesData,
          content
        )
      ),
    [content]
  )

  const game = useMemo(
    () =>
      mergedGames.find(
        (item) =>
          item.slug === selectedGame
      ) || mergedGames[0],
    [mergedGames, selectedGame]
  )

  const currentGuide =
    !isCreatingGuide && game?.guides
      ? game.guides[selectedGuide]
      : null

  const isEditingCMSGuide =
    !isCreatingGuide &&
    !!currentGuide?.cmsGuideId

  /*
   * ==========================================================
   * COLLECTION DATA
   * ==========================================================
   */

  const collectionItems = useMemo(() => {
    if (!game || !selectedCollection) {
      return []
    }

    return getGameCollection(
      game,
      selectedCollection
    )
  }, [
    game,
    selectedCollection,
  ])

  const collectionOverrides = useMemo(() => {
    if (!selectedGame || !selectedCollection) {
      return {}
    }

    return parseCMSCollectionOverrides(
      content,
      selectedGame,
      selectedCollection
    )
  }, [
    content,
    selectedGame,
    selectedCollection,
  ])

  /*
   * ==========================================================
   * GAME SETTINGS
   * ==========================================================
   */

  const gameSettingsDraft = useMemo(() => {
    if (!game) {
      return {}
    }

    return getEditableGameFields(game)
  }, [game])

  /*
   * ==========================================================
   * SESSION
   * ==========================================================
   */

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetch(
          '/api/admin/check',
          {
            credentials: 'include',
            cache: 'no-store',
          }
        )

        const data =
          await response.json()

        setAuthenticated(
          data?.authenticated === true
        )
      } catch {
        setAuthenticated(false)
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    if (authenticated) {
      loadContent()
    }
  }, [authenticated])

  /*
   * ==========================================================
   * GUIDE EDITOR SYNC
   * ==========================================================
   */

  useEffect(() => {
    if (!isCreatingGuide && currentGuide) {
      setEditorDraft(
        cloneGuide(currentGuide)
      )
    }
  }, [
    selectedGame,
    selectedGuide,
    isCreatingGuide,
    currentGuide?.cmsGuideId,
    currentGuide?.cmsBuiltInGuideIndex,
  ])

  /*
   * ==========================================================
   * COLLECTION EDITOR SYNC
   * ==========================================================
   */

  useEffect(() => {
    if (isCreatingItem) {
      return
    }

    const foundIndex =
      collectionItems.findIndex(
        (item, index) =>
          getRecordId(item, index) ===
          selectedItemId
      )

    if (foundIndex >= 0) {
      const found =
        collectionItems[foundIndex]

      const cloned =
        cloneObject(found)

      setCollectionDraft(cloned)

      setCollectionDraftText(
        JSON.stringify(
          cloned,
          null,
          2
        )
      )
    } else {
      setCollectionDraft(null)
      setCollectionDraftText('')
    }
  }, [
    collectionItems,
    selectedItemId,
    isCreatingItem,
  ])

  /*
   * ==========================================================
   * GAME SETTINGS SYNC
   * ==========================================================
   */

  useEffect(() => {
    if (
      activeSection === 'game-settings' &&
      game
    ) {
      setGameDraftText(
        JSON.stringify(
          gameSettingsDraft,
          null,
          2
        )
      )
    }
  }, [
    activeSection,
    selectedGame,
    game?.slug,
  ])

  async function loadContent() {
    const data =
      await fetchCMSContent()

    setContent(data || {})
  }

  /*
   * ==========================================================
   * LOGIN
   * ==========================================================
   */

  async function handleLogin(event) {
    event.preventDefault()

    setLoginError('')
    setMessage('')

    if (!password.trim()) {
      setLoginError(
        'Please enter the admin password.'
      )
      return
    }

    try {
      const response =
        await fetch(
          '/api/admin/login',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              password,
            }),
          }
        )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data?.authenticated
      ) {
        setLoginError(
          data?.error ||
            'Invalid admin password.'
        )
        return
      }

      setPassword('')
      setAuthenticated(true)
      setMessage(
        'Login successful.'
      )
    } catch {
      setLoginError(
        'Unable to connect to the server.'
      )
    }
  }

  async function handleLogout() {
    try {
      await fetch(
        '/api/admin/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      )
    } catch {}

    setAuthenticated(false)
    setContent({})
    setEditorDraft(null)
    setCollectionDraft(null)
    setGameDraftText('')
  }

  /*
   * ==========================================================
   * D1 SAVE / DELETE
   * ==========================================================
   */

  async function saveContentItem(
    key,
    value
  ) {
    const response =
      await fetch(
        '/api/admin/content',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            key,
            value,
          }),
        }
      )

    if (!response.ok) {
      let error =
        'Failed to save content.'

      try {
        const data =
          await response.json()

        if (data?.error) {
          error = data.error
        }
      } catch {}

      throw new Error(error)
    }

    setContent((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  async function deleteContentItem(key) {
    const response =
      await fetch(
        `/api/admin/content?key=${encodeURIComponent(
          key
        )}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

    if (!response.ok) {
      throw new Error(
        'Failed to delete content.'
      )
    }

    setContent((previous) => {
      const next = {
        ...previous,
      }

      delete next[key]

      return next
    })
  }

  /*
   * ==========================================================
   * GAME SETTINGS
   * ==========================================================
   */

  function openGameSettings(gameSlug) {
    setSelectedGame(gameSlug)
    setActiveSection('game-settings')
    setSelectedCollection(
      COLLECTIONS[gameSlug]?.[0]?.[0] ||
        'characters'
    )
    setMessage('')
  }

  function updateGameDraftText(value) {
    setGameDraftText(value)
  }

  async function saveGameSettings() {
    if (!game) {
      return
    }

    let parsed

    try {
      parsed =
        JSON.parse(
          gameDraftText
        )
    } catch {
      setMessage(
        'Invalid JSON. Please fix the Game Data before saving.'
      )
      return
    }

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      setMessage(
        'Game Data must be a JSON object.'
      )
      return
    }

    /*
     * These fields are controlled by specialized
     * CMS systems and must not be overwritten here.
     */
    delete parsed.guides
    delete parsed.characters
    delete parsed.heroes
    delete parsed.slug

    setSaving(true)
    setMessage('')

    try {
      const key =
        cmsGameFieldsKey(
          game.slug
        )

      await saveContentItem(
        key,
        JSON.stringify(parsed)
      )

      setMessage(
        'Game data saved successfully.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to save game data.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function resetGameSettings() {
    if (!game) {
      return
    }

    const confirmed =
      window.confirm(
        `Reset all CMS changes for "${game.name}" and restore the original game data?`
      )

    if (!confirmed) {
      return
    }

    setSaving(true)
    setMessage('')

    try {
      await deleteContentItem(
        cmsGameFieldsKey(
          game.slug
        )
      )

      setGameDraftText(
        JSON.stringify(
          getEditableGameFields(
            game
          ),
          null,
          2
        )
      )

      setMessage(
        'Game data reset successfully. Original data restored.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to reset game data.'
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * ==========================================================
   * COLLECTION CMS
   * ==========================================================
   */

  function openCollection(
    gameSlug,
    collection
  ) {
    setSelectedGame(gameSlug)
    setSelectedCollection(collection)
    setActiveSection('collection')
    setSelectedItemId('')
    setCollectionDraft(null)
    setCollectionDraftText('')
    setIsCreatingItem(false)
    setMessage('')
  }

  function createCollectionItem() {
    setIsCreatingItem(true)
    setSelectedItemId('')

    const newItem = {
      id: makeId(),
      title: '',
      slug: '',
      description: '',
      image: '',
      status: 'published',
      content: '',
    }

    setCollectionDraft(newItem)

    setCollectionDraftText(
      JSON.stringify(
        newItem,
        null,
        2
      )
    )

    setMessage('')
  }

  function updateCollectionDraftText(
    value
  ) {
    setCollectionDraftText(value)

    try {
      const parsed =
        JSON.parse(value)

      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        setCollectionDraft(parsed)
      }
    } catch {
      /*
       * Keep textarea editable even when JSON
       * is temporarily invalid.
       */
    }
  }

  async function saveCollectionItem() {
    let parsed

    try {
      parsed =
        JSON.parse(
          collectionDraftText
        )
    } catch {
      setMessage(
        'Invalid JSON. Please fix the record before saving.'
      )
      return
    }

    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed)
    ) {
      setMessage(
        'Collection record must be a JSON object.'
      )
      return
    }

    setSaving(true)
    setMessage('')

    try {
      if (isCreatingItem) {
        /*
         * -------------------------
         * CMS-created item
         * -------------------------
         */

        const key =
          cmsCollectionKey(
            selectedGame,
            selectedCollection
          )

        const existing =
          parseCMSCollection(
            content,
            selectedGame,
            selectedCollection
          )

        const cleanItem = {
          ...parsed,
          id:
            parsed.id ||
            makeId(),
        }

        const existingIndex =
          existing.findIndex(
            (item) =>
              item?.id ===
              cleanItem.id
          )

        if (existingIndex >= 0) {
          existing[
            existingIndex
          ] = cleanItem
        } else {
          existing.push(
            cleanItem
          )
        }

        await saveContentItem(
          key,
          JSON.stringify(existing)
        )

        setSelectedItemId(
          cleanItem.id
        )

        setIsCreatingItem(false)

        setMessage(
          'New content saved successfully.'
        )
      } else {
        /*
         * -------------------------
         * Built-in item override
         * -------------------------
         */

        const recordId =
          getRecordId(
            collectionDraft
          )

        if (!recordId) {
          throw new Error(
            'Unable to identify this built-in record.'
          )
        }

        const key =
          cmsCollectionOverridesKey(
            selectedGame,
            selectedCollection
          )

        const overrides =
          parseCMSCollectionOverrides(
            content,
            selectedGame,
            selectedCollection
          )

        /*
         * Do not save internal CMS markers.
         */
        const cleanOverride = {
          ...parsed,
        }

        delete cleanOverride._cmsSourceId
        delete cleanOverride._cmsBuiltIn
        delete cleanOverride._cmsCreated
        delete cleanOverride._cmsOverridden

        /*
         * Keep the original record ID stable.
         */
        overrides[
          recordId
        ] = cleanOverride

        await saveContentItem(
          key,
          JSON.stringify(
            overrides
          )
        )

        setMessage(
          'Built-in content updated successfully.'
        )
      }
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to save content.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteCollectionItem() {
    if (!collectionDraft) {
      return
    }

    /*
     * CMS-created record:
     * permanently remove it from CMS collection.
     */
    if (isCreatingItem ||
        collectionDraft._cmsCreated) {
      const title =
        getRecordLabel(
          collectionDraft
        )

      const confirmed =
        window.confirm(
          `Delete "${title}"?`
        )

      if (!confirmed) {
        return
      }

      setSaving(true)

      try {
        const key =
          cmsCollectionKey(
            selectedGame,
            selectedCollection
          )

        const existing =
          parseCMSCollection(
            content,
            selectedGame,
            selectedCollection
          )

        const recordId =
          getRecordId(
            collectionDraft
          )

        const updated =
          existing.filter(
            (item, index) =>
              getRecordId(
                item,
                index
              ) !== recordId
          )

        await saveContentItem(
          key,
          JSON.stringify(
            updated
          )
        )

        setCollectionDraft(null)
        setCollectionDraftText('')
        setSelectedItemId('')
        setIsCreatingItem(false)

        setMessage(
          'CMS content deleted successfully.'
        )
      } catch (error) {
        setMessage(
          error?.message ||
            'Failed to delete content.'
        )
      } finally {
        setSaving(false)
      }

      return
    }

    /*
     * Built-in record:
     * Delete means RESET CMS override.
     * Original built-in data is restored.
     */
    const recordName =
      getRecordLabel(
        collectionDraft
      )

    const confirmed =
      window.confirm(
        `Reset "${recordName}" to the original built-in data?`
      )

    if (!confirmed) {
      return
    }

    setSaving(true)

    try {
      const key =
        cmsCollectionOverridesKey(
          selectedGame,
          selectedCollection
        )

      const overrides =
        parseCMSCollectionOverrides(
          content,
          selectedGame,
          selectedCollection
        )

      const recordId =
        getRecordId(
          collectionDraft
        )

      delete overrides[
        recordId
      ]

      if (
        Object.keys(
          overrides
        ).length === 0
      ) {
        await deleteContentItem(
          key
        )
      } else {
        await saveContentItem(
          key,
          JSON.stringify(
            overrides
          )
        )
      }

      setCollectionDraft(null)
      setCollectionDraftText('')
      setSelectedItemId('')

      setMessage(
        'Original built-in data restored successfully.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to reset content.'
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * ==========================================================
   * GUIDE SYSTEM
   * ==========================================================
   */

  function startNewGuide() {
    setIsCreatingGuide(true)

    setNewGuide(
      cloneGuide({
        ...EMPTY_GUIDE,
      })
    )

    setEditorDraft(null)
    setMessage('')
  }

  function cancelNewGuide() {
    setIsCreatingGuide(false)
    setEditorDraft(null)
  }

  function updateNewGuideField(
    field,
    value
  ) {
    setNewGuide(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    )
  }

  function updateNewSectionHeading(
    sectionIndex,
    value
  ) {
    setNewGuide(
      (previous) => ({
        ...previous,
        content:
          previous.content.map(
            (section, index) =>
              index === sectionIndex
                ? {
                    ...section,
                    heading: value,
                  }
                : section
          ),
      })
    )
  }

  function updateNewParagraph(
    sectionIndex,
    paragraphIndex,
    value
  ) {
    setNewGuide(
      (previous) => ({
        ...previous,
        content:
          previous.content.map(
            (section, index) =>
              index === sectionIndex
                ? {
                    ...section,
                    paragraphs:
                      section.paragraphs.map(
                        (
                          paragraph,
                          index2
                        ) =>
                          index2 ===
                          paragraphIndex
                            ? value
                            : paragraph
                      ),
                  }
                : section
          ),
      })
    )
  }

  function addNewSection() {
    setNewGuide(
      (previous) => ({
        ...previous,
        content: [
          ...previous.content,
          {
            heading: 'New Section',
            paragraphs: [
              'Write your paragraph here.',
            ],
          },
        ],
      })
    )
  }

  function deleteNewSection(index) {
    setNewGuide(
      (previous) => ({
        ...previous,
        content:
          previous.content.filter(
            (_, i) =>
              i !== index
          ),
      })
    )
  }

  function addNewParagraph(index) {
    setNewGuide(
      (previous) => ({
        ...previous,
        content:
          previous.content.map(
            (section, i) =>
              i === index
                ? {
                    ...section,
                    paragraphs: [
                      ...(section.paragraphs ||
                        []),
                      'Write your paragraph here.',
                    ],
                  }
                : section
          ),
      })
    )
  }

  function addNewVideo(index) {
    setNewGuide(
      (previous) => ({
        ...previous,
        content:
          previous.content.map(
            (section, i) =>
              i === index
                ? {
                    ...section,
                    paragraphs: [
                      ...(section.paragraphs ||
                        []),
                      `${VIDEO_PREFIX}https://www.youtube.com/watch?v=`,
                    ],
                  }
                : section
          ),
      })
    )
  }

  function deleteNewParagraph(
    sectionIndex,
    paragraphIndex
  ) {
    setNewGuide(
      (previous) => ({
        ...previous,
        content:
          previous.content.map(
            (section, index) =>
              index === sectionIndex
                ? {
                    ...section,
                    paragraphs:
                      section.paragraphs.filter(
                        (_, i) =>
                          i !==
                          paragraphIndex
                      ),
                  }
                : section
          ),
      })
    )
  }

  async function saveNewGuide() {
    if (!game) return

    if (!newGuide.title.trim()) {
      setMessage(
        'Please enter a guide title.'
      )
      return
    }

    if (!newGuide.desc.trim()) {
      setMessage(
        'Please enter a guide description.'
      )
      return
    }

    setSaving(true)

    try {
      const key =
        cmsGuidesKey(
          game.slug
        )

      let existing = []

      try {
        const parsed =
          JSON.parse(
            content[key] || '[]'
          )

        if (Array.isArray(parsed)) {
          existing = parsed
        }
      } catch {}

      const guide = {
        cmsGuideId: makeId(),
        icon:
          newGuide.icon.trim() ||
          '📖',
        title:
          newGuide.title.trim(),
        desc:
          newGuide.desc.trim(),
        content:
          newGuide.content,
      }

      await saveContentItem(
        key,
        JSON.stringify([
          ...existing,
          guide,
        ])
      )

      setIsCreatingGuide(false)
      setSelectedGuide(
        (game.guides?.length || 1) - 1
      )

      setMessage(
        'New guide created successfully.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to create guide.'
      )
    } finally {
      setSaving(false)
    }
  }

  function updateEditorField(
    field,
    value
  ) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              [field]: value,
            }
          : previous
    )
  }

  function updateEditorSectionHeading(
    sectionIndex,
    value
  ) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content:
                previous.content.map(
                  (section, index) =>
                    index ===
                    sectionIndex
                      ? {
                          ...section,
                          heading:
                            value,
                        }
                      : section
                ),
            }
          : previous
    )
  }

  function updateEditorParagraph(
    sectionIndex,
    paragraphIndex,
    value
  ) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content:
                previous.content.map(
                  (section, index) =>
                    index ===
                    sectionIndex
                      ? {
                          ...section,
                          paragraphs:
                            section.paragraphs.map(
                              (
                                paragraph,
                                index2
                              ) =>
                                index2 ===
                                paragraphIndex
                                  ? value
                                  : paragraph
                            ),
                        }
                      : section
                ),
            }
          : previous
    )
  }

  function addEditorSection() {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content: [
                ...(previous.content ||
                  []),
                {
                  heading:
                    'New Section',
                  paragraphs: [
                    'Write your paragraph here.',
                  ],
                },
              ],
            }
          : previous
    )
  }

  function deleteEditorSection(index) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content:
                previous.content.filter(
                  (_, i) =>
                    i !== index
                ),
            }
          : previous
    )
  }

  function addEditorParagraph(index) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content:
                previous.content.map(
                  (section, i) =>
                    i === index
                      ? {
                          ...section,
                          paragraphs: [
                            ...(section.paragraphs ||
                              []),
                            'Write your paragraph here.',
                          ],
                        }
                      : section
                ),
            }
          : previous
    )
  }

  function addEditorVideo(index) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content:
                previous.content.map(
                  (section, i) =>
                    i === index
                      ? {
                          ...section,
                          paragraphs: [
                            ...(section.paragraphs ||
                              []),
                            `${VIDEO_PREFIX}https://www.youtube.com/watch?v=`,
                          ],
                        }
                      : section
                ),
            }
          : previous
    )
  }

  function deleteEditorParagraph(
    sectionIndex,
    paragraphIndex
  ) {
    setEditorDraft(
      (previous) =>
        previous
          ? {
              ...previous,
              content:
                previous.content.map(
                  (section, index) =>
                    index ===
                    sectionIndex
                      ? {
                          ...section,
                          paragraphs:
                            section.paragraphs.filter(
                              (_, i) =>
                                i !==
                                paragraphIndex
                            ),
                        }
                      : section
                ),
            }
          : previous
    )
  }

  async function saveExistingGuide() {
    if (
      !game ||
      !currentGuide ||
      !editorDraft
    ) {
      return
    }

    setSaving(true)

    try {
      if (isEditingCMSGuide) {
        const key =
          cmsGuidesKey(
            game.slug
          )

        const existing =
          JSON.parse(
            content[key] || '[]'
          )

        const index =
          existing.findIndex(
            (guide) =>
              guide?.cmsGuideId ===
              currentGuide.cmsGuideId
          )

        if (index < 0) {
          throw new Error(
            'CMS guide not found.'
          )
        }

        existing[index] = {
          ...existing[index],
          icon:
            editorDraft.icon ||
            '📖',
          title:
            editorDraft.title,
          desc:
            editorDraft.desc,
          content:
            editorDraft.content,
        }

        await saveContentItem(
          key,
          JSON.stringify(existing)
        )

        setMessage(
          'Guide updated successfully.'
        )

        return
      }

      const guideIndex =
        currentGuide.cmsBuiltInGuideIndex ??
        selectedGuide

      await saveContentItem(
        cmsTitleKey(
          game.slug,
          guideIndex
        ),
        editorDraft.title || ''
      )

      await saveContentItem(
        cmsDescKey(
          game.slug,
          guideIndex
        ),
        editorDraft.desc || ''
      )

      await saveContentItem(
        cmsStructureKey(
          game.slug,
          guideIndex
        ),
        JSON.stringify(
          editorDraft.content || []
        )
      )

      setMessage(
        'Guide saved successfully.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to save guide.'
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteCurrentGuide() {
    if (!game || !currentGuide) {
      return
    }

    const confirmed =
      window.confirm(
        `Delete "${currentGuide.title}"?`
      )

    if (!confirmed) return

    setSaving(true)

    try {
      if (isEditingCMSGuide) {
        const key =
          cmsGuidesKey(
            game.slug
          )

        const existing =
          JSON.parse(
            content[key] || '[]'
          )

        const updated =
          existing.filter(
            (guide) =>
              guide?.cmsGuideId !==
              currentGuide.cmsGuideId
          )

        await saveContentItem(
          key,
          JSON.stringify(updated)
        )
      } else {
        const index =
          currentGuide.cmsBuiltInGuideIndex ??
          selectedGuide

        const key =
          cmsDeletedGuidesKey(
            game.slug
          )

        let indexes = []

        try {
          indexes =
            JSON.parse(
              content[key] || '[]'
            )
        } catch {}

        if (
          !indexes.includes(index)
        ) {
          indexes.push(index)
        }

        await saveContentItem(
          key,
          JSON.stringify(indexes)
        )
      }

      setSelectedGuide(0)
      setEditorDraft(null)

      setMessage(
        'Guide deleted successfully.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to delete guide.'
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * ==========================================================
   * DASHBOARD
   * ==========================================================
   */

  const dashboardStats = useMemo(() => {
    let collectionCount = 0
    let overriddenCount = 0

    Object.keys(content).forEach(
      (key) => {
        if (
          key.startsWith(
            'cms.collection.'
          )
        ) {
          try {
            const items =
              JSON.parse(
                content[key]
              )

            if (Array.isArray(items)) {
              collectionCount +=
                items.length
            }
          } catch {}
        }

        if (
          key.startsWith(
            'cms.override.'
          )
        ) {
          try {
            const items =
              JSON.parse(
                content[key]
              )

            if (
              items &&
              typeof items === 'object'
            ) {
              overriddenCount +=
                Object.keys(
                  items
                ).length
            }
          } catch {}
        }
      }
    )

    let guideCount = 0

    mergedGames.forEach((item) => {
      guideCount +=
        item.guides?.length || 0
    })

    return {
      games: mergedGames.length,
      guides: guideCount,
      collectionCount,
      overriddenCount,
      cmsKeys:
        Object.keys(content).length,
    }
  }, [
    content,
    mergedGames,
  ])

  /*
   * ==========================================================
   * LOGIN
   * ==========================================================
   */

  if (checkingSession) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-card">
            <h1>GameNexa Admin</h1>
            <p>
              Checking admin session...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-card admin-login-card">
            <div className="admin-header">
              <div>
                <div className="admin-logo">
                  Game
                  <span>Nexa</span>
                </div>

                <p>
                  Content Management System
                </p>
              </div>

              <Link
                to="/"
                className="admin-back-link"
              >
                ← Website
              </Link>
            </div>

            <form
              onSubmit={handleLogin}
              className="admin-login-form"
            >
              <label>
                Admin Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter admin password"
                autoComplete="current-password"
              />

              {loginError && (
                <div className="admin-error">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="admin-primary-button"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  /*
   * ==========================================================
   * ADMIN UI
   * ==========================================================
   */

  const collectionName =
    (
      COLLECTIONS[
        selectedGame
      ] || []
    ).find(
      ([id]) =>
        id === selectedCollection
    )?.[1] ||
    selectedCollection

  const selectedRecord =
    collectionDraft

  const selectedRecordIsBuiltIn =
    !!selectedRecord &&
    !selectedRecord._cmsCreated &&
    !isCreatingItem

  const selectedRecordIsOverridden =
    selectedRecordIsBuiltIn &&
    !!selectedRecord._cmsOverridden

  return (
    <div className="admin-page">
      <div className="admin-container">

        <header className="admin-topbar">
          <div>
            <div className="admin-logo">
              Game
              <span>Nexa</span>
            </div>

            <p>
              WordPress-style CMS
            </p>
          </div>

          <div className="admin-top-actions">
            <Link
              to="/"
              className="admin-secondary-button"
            >
              View Website
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="admin-secondary-button"
            >
              Logout
            </button>
          </div>
        </header>

        {message && (
          <div
            className={
              message
                .toLowerCase()
                .includes('failed') ||
              message
                .toLowerCase()
                .includes('please') ||
              message
                .toLowerCase()
                .includes('invalid') ||
              message
                .toLowerCase()
                .includes('not found')
                ? 'admin-error'
                : 'admin-success'
            }
          >
            {message}
          </div>
        )}

        <div className="admin-layout">

          <aside className="admin-sidebar">

            <button
              type="button"
              className={
                activeSection ===
                'dashboard'
                  ? 'admin-nav-button active'
                  : 'admin-nav-button'
              }
              onClick={() =>
                setActiveSection(
                  'dashboard'
                )
              }
            >
              📊 Dashboard
            </button>

            <div className="admin-nav-title">
              Content
            </div>

            <button
              type="button"
              className={
                activeSection ===
                'guides'
                  ? 'admin-nav-button active'
                  : 'admin-nav-button'
              }
              onClick={() =>
                setActiveSection(
                  'guides'
                )
              }
            >
              📖 Guides
            </button>

            <div className="admin-nav-title">
              Games
            </div>

            {mergedGames.map(
              (item) => (
                <div
                  key={item.slug}
                  className="admin-game-menu"
                >
                  <div className="admin-game-title">
                    {item.name}
                  </div>

                  <button
                    type="button"
                    className={
                      activeSection ===
                        'game-settings' &&
                      selectedGame ===
                        item.slug
                        ? 'admin-nav-button sub active'
                        : 'admin-nav-button sub'
                    }
                    onClick={() =>
                      openGameSettings(
                        item.slug
                      )
                    }
                  >
                    ⚙️ Game Data
                  </button>

                  {(
                    COLLECTIONS[
                      item.slug
                    ] || []
                  ).map(
                    ([id, label]) => (
                      <button
                        type="button"
                        key={id}
                        className={
                          activeSection ===
                            'collection' &&
                          selectedGame ===
                            item.slug &&
                          selectedCollection ===
                            id
                            ? 'admin-nav-button sub active'
                            : 'admin-nav-button sub'
                        }
                        onClick={() =>
                          openCollection(
                            item.slug,
                            id
                          )
                        }
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              )
            )}

          </aside>

          <main className="admin-main">

            {/*
             * ==================================================
             * DASHBOARD
             * ==================================================
             */}

            {activeSection ===
              'dashboard' && (
              <div className="admin-card">

                <div className="admin-editor-toolbar">
                  <div>
                    <h1>
                      Dashboard
                    </h1>

                    <p>
                      Manage all GameNexa
                      content from one place.
                    </p>
                  </div>
                </div>

                <div className="admin-stat-grid">

                  <div className="admin-stat-card">
                    <strong>
                      {dashboardStats.games}
                    </strong>
                    <span>
                      Games
                    </span>
                  </div>

                  <div className="admin-stat-card">
                    <strong>
                      {dashboardStats.guides}
                    </strong>
                    <span>
                      Guides
                    </span>
                  </div>

                  <div className="admin-stat-card">
                    <strong>
                      {
                        dashboardStats.collectionCount
                      }
                    </strong>
                    <span>
                      CMS Items
                    </span>
                  </div>

                  <div className="admin-stat-card">
                    <strong>
                      {
                        dashboardStats.overriddenCount
                      }
                    </strong>
                    <span>
                      Edited Built-ins
                    </span>
                  </div>

                  <div className="admin-stat-card">
                    <strong>
                      {
                        dashboardStats.cmsKeys
                      }
                    </strong>
                    <span>
                      Database Entries
                    </span>
                  </div>

                </div>

                <div className="admin-dashboard-grid">

                  {mergedGames.map(
                    (item) => (
                      <div
                        className="admin-dashboard-game"
                        key={
                          item.slug
                        }
                      >
                        <h2>
                          {item.name}
                        </h2>

                        <button
                          type="button"
                          onClick={() =>
                            openGameSettings(
                              item.slug
                            )
                          }
                          className="admin-primary-button"
                        >
                          Manage Game
                        </button>
                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/*
             * ==================================================
             * GAME SETTINGS
             * ==================================================
             */}

            {activeSection ===
              'game-settings' && (
              <div className="admin-card">

                <div className="admin-editor-toolbar">
                  <div>
                    <h1>
                      {game?.name ||
                        'Game Data'}
                    </h1>

                    <p>
                      Edit the main game
                      information used across
                      GameNexa.
                    </p>
                  </div>

                  <div className="admin-inline-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setGameDraftText(
                          JSON.stringify(
                            getEditableGameFields(
                              game
                            ),
                            null,
                            2
                          )
                        )
                      }
                      className="admin-secondary-button"
                    >
                      Reload Original View
                    </button>

                    <button
                      type="button"
                      onClick={
                        resetGameSettings
                      }
                      className="admin-danger-button"
                      disabled={
                        saving
                      }
                    >
                      Reset Changes
                    </button>
                  </div>
                </div>

                <div className="admin-section">

                  <h2>
                    Main Game Data
                  </h2>

                  <p>
                    Edit the JSON fields below.
                    Guides and Characters/Heroes
                    are managed separately so
                    existing CMS data is not
                    damaged.
                  </p>

                  <div className="admin-field">

                    <label>
                      Game Data JSON
                    </label>

                    <textarea
                      rows={32}
                      value={
                        gameDraftText
                      }
                      onChange={(event) =>
                        updateGameDraftText(
                          event.target.value
                        )
                      }
                      spellCheck={false}
                    />

                  </div>

                </div>

                <div className="admin-actions">

                  <button
                    type="button"
                    onClick={
                      resetGameSettings
                    }
                    className="admin-danger-button"
                    disabled={saving}
                  >
                    Reset to Original
                  </button>

                  <button
                    type="button"
                    onClick={
                      saveGameSettings
                    }
                    className="admin-primary-button"
                    disabled={saving}
                  >
                    {saving
                      ? 'Saving...'
                      : 'Save Game Data'}
                  </button>

                </div>

              </div>
            )}

            {/*
             * ==================================================
             * COLLECTION
             * ==================================================
             */}

            {activeSection ===
              'collection' && (
              <div className="admin-card">

                <div className="admin-editor-toolbar">

                  <div>
                    <h1>
                      {collectionName}
                    </h1>

                    <p>
                      {
                        mergedGames.find(
                          (item) =>
                            item.slug ===
                            selectedGame
                        )?.name
                      }{' '}
                      →{' '}
                      {collectionName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      createCollectionItem
                    }
                    className="admin-primary-button"
                  >
                    + Add New
                  </button>

                </div>

                <div className="admin-content-manager">

                  <div className="admin-item-list">

                    {collectionItems.length ===
                    0 ? (
                      <div className="admin-empty">

                        <h2>
                          No content yet
                        </h2>

                        <p>
                          No built-in or CMS
                          records were found
                          for this collection.
                        </p>

                      </div>
                    ) : (
                      collectionItems.map(
                        (
                          item,
                          index
                        ) => {
                          const id =
                            getRecordId(
                              item,
                              index
                            )

                          const isBuiltIn =
                            item?._cmsBuiltIn ===
                            true

                          const isOverridden =
                            item?._cmsOverridden ===
                            true

                          return (
                            <button
                              type="button"
                              key={id}
                              className={
                                selectedItemId ===
                                id
                                  ? 'admin-item active'
                                  : 'admin-item'
                              }
                              onClick={() => {
                                setIsCreatingItem(
                                  false
                                )
                                setSelectedItemId(
                                  id
                                )
                              }}
                            >

                              <strong>
                                {
                                  getRecordLabel(
                                    item,
                                    index
                                  )
                                }
                              </strong>

                              <span>
                                {isBuiltIn
                                  ? isOverridden
                                    ? 'Built-in • Edited'
                                    : 'Built-in'
                                  : 'CMS'}
                              </span>

                            </button>
                          )
                        }
                      )
                    )}

                  </div>

                  <div className="admin-item-editor">

                    {collectionDraft ? (
                      <>

                        <div className="admin-section">

                          <div className="admin-section-header">

                            <div>
                              <h2>
                                {isCreatingItem
                                  ? 'Create New Content'
                                  : 'Edit Content'}
                              </h2>

                              {!isCreatingItem &&
                                selectedRecordIsBuiltIn && (
                                  <p>
                                    {selectedRecordIsOverridden
                                      ? 'This built-in record has a CMS override.'
                                      : 'This is the original built-in record. Saving creates a CMS override.'}
                                  </p>
                                )}
                            </div>

                          </div>

                          <div className="admin-field">

                            <label>
                              Complete Record JSON
                            </label>

                            <textarea
                              rows={32}
                              value={
                                collectionDraftText
                              }
                              onChange={(event) =>
                                updateCollectionDraftText(
                                  event.target.value
                                )
                              }
                              spellCheck={false}
                            />

                          </div>

                        </div>

                        <div className="admin-actions">

                          <button
                            type="button"
                            onClick={
                              deleteCollectionItem
                            }
                            className="admin-danger-button"
                            disabled={
                              saving
                            }
                          >
                            {isCreatingItem ||
                            selectedRecord?._cmsCreated
                              ? 'Delete Content'
                              : 'Reset to Original'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const current =
                                collectionItems.find(
                                  (
                                    item,
                                    index
                                  ) =>
                                    getRecordId(
                                      item,
                                      index
                                    ) ===
                                    selectedItemId
                                )

                              if (
                                current
                              ) {
                                const cloned =
                                  cloneObject(
                                    current
                                  )

                                setCollectionDraft(
                                  cloned
                                )

                                setCollectionDraftText(
                                  JSON.stringify(
                                    cloned,
                                    null,
                                    2
                                  )
                                )
                              }
                            }}
                            className="admin-secondary-button"
                            disabled={
                              saving
                            }
                          >
                            Reload
                          </button>

                          <button
                            type="button"
                            onClick={
                              saveCollectionItem
                            }
                            className="admin-primary-button"
                            disabled={
                              saving
                            }
                          >
                            {saving
                              ? 'Saving...'
                              : isCreatingItem
                                ? 'Create Content'
                                : 'Save Changes'}
                          </button>

                        </div>

                      </>
                    ) : (
                      <div className="admin-empty">

                        <h2>
                          Select Content
                        </h2>

                        <p>
                          Built-in records are
                          automatically shown
                          here. Select one to
                          edit it, or create a
                          new CMS record.
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            )}

            {/*
             * ==================================================
             * GUIDES
             * ==================================================
             */}

            {activeSection ===
              'guides' && (
              <div className="admin-card">

                <div className="admin-editor-toolbar">

                  <div>
                    <h1>
                      {isCreatingGuide
                        ? 'Create New Guide'
                        : 'Guide Editor'}
                    </h1>

                    <p>
                      Manage GameNexa guide
                      content.
                    </p>
                  </div>

                  {!isCreatingGuide && (
                    <button
                      type="button"
                      onClick={
                        startNewGuide
                      }
                      className="admin-primary-button"
                    >
                      + New Guide
                    </button>
                  )}

                </div>

                <div className="admin-select-grid">

                  <div className="admin-field">

                    <label>
                      Game
                    </label>

                    <select
                      value={
                        selectedGame
                      }
                      onChange={(event) => {
                        setSelectedGame(
                          event.target
                            .value
                        )

                        setSelectedGuide(
                          0
                        )

                        setIsCreatingGuide(
                          false
                        )
                      }}
                      disabled={
                        isCreatingGuide
                      }
                    >
                      {mergedGames.map(
                        (item) => (
                          <option
                            key={
                              item.slug
                            }
                            value={
                              item.slug
                            }
                          >
                            {item.name}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                  <div className="admin-field">

                    <label>
                      Guide
                    </label>

                    <select
                      value={
                        isCreatingGuide
                          ? ''
                          : selectedGuide
                      }
                      onChange={(event) => {
                        setSelectedGuide(
                          Number(
                            event
                              .target
                              .value
                          )
                        )

                        setIsCreatingGuide(
                          false
                        )
                      }}
                      disabled={
                        isCreatingGuide
                      }
                    >
                      {game?.guides?.map(
                        (
                          item,
                          index
                        ) => (
                          <option
                            key={
                              item.cmsGuideId ||
                              `${game.slug}-${index}`
                            }
                            value={
                              index
                            }
                          >
                            {index + 1}.{' '}
                            {item.title}
                            {item.cmsGuideId
                              ? ' (CMS)'
                              : ''}
                          </option>
                        )
                      )}
                    </select>

                  </div>

                </div>

                {isCreatingGuide ? (
                  <GuideEditor
                    guide={
                      newGuide
                    }
                    setGuide={
                      setNewGuide
                    }
                    isNew
                    saving={saving}
                    onSave={
                      saveNewGuide
                    }
                    onCancel={
                      cancelNewGuide
                    }
                    onAddSection={
                      addNewSection
                    }
                    onDeleteSection={
                      deleteNewSection
                    }
                    onAddParagraph={
                      addNewParagraph
                    }
                    onAddVideo={
                      addNewVideo
                    }
                    onDeleteParagraph={
                      deleteNewParagraph
                    }
                    onUpdateSectionHeading={
                      updateNewSectionHeading
                    }
                    onUpdateParagraph={
                      updateNewParagraph
                    }
                  />
                ) : editorDraft ? (
                  <GuideEditor
                    guide={
                      editorDraft
                    }
                    setGuide={
                      setEditorDraft
                    }
                    saving={saving}
                    onSave={
                      saveExistingGuide
                    }
                    onDelete={
                      deleteCurrentGuide
                    }
                    onAddSection={
                      addEditorSection
                    }
                    onDeleteSection={
                      deleteEditorSection
                    }
                    onAddParagraph={
                      addEditorParagraph
                    }
                    onAddVideo={
                      addEditorVideo
                    }
                    onDeleteParagraph={
                      deleteEditorParagraph
                    }
                    onUpdateSectionHeading={
                      updateEditorSectionHeading
                    }
                    onUpdateParagraph={
                      updateEditorParagraph
                    }
                    isCMS={
                      isEditingCMSGuide
                    }
                  />
                ) : (
                  <div className="admin-empty">
                    No guide selected.
                  </div>
                )}

              </div>
            )}

          </main>

        </div>

        <footer className="admin-footer">
          GameNexa CMS
        </footer>

      </div>
    </div>
  )
}

function GuideEditor({
  guide,
  setGuide,
  isNew,
  saving,
  onSave,
  onDelete,
  onCancel,
  onAddSection,
  onDeleteSection,
  onAddParagraph,
  onAddVideo,
  onDeleteParagraph,
  onUpdateSectionHeading,
  onUpdateParagraph,
  isCMS,
}) {
  function updateField(
    field,
    value
  ) {
    setGuide((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  return (
    <>

      <div className="admin-section">

        <h2>
          Guide Details
        </h2>

        <div className="admin-field">

          <label>
            Icon
          </label>

          <input
            value={
              guide.icon || '📖'
            }
            onChange={(event) =>
              updateField(
                'icon',
                event.target.value
              )
            }
            disabled={
              !isNew && !isCMS
            }
          />

        </div>

        <div className="admin-field">

          <label>
            Guide Title
          </label>

          <input
            value={
              guide.title || ''
            }
            onChange={(event) =>
              updateField(
                'title',
                event.target.value
              )
            }
          />

        </div>

        <div className="admin-field">

          <label>
            Description
          </label>

          <textarea
            rows={4}
            value={
              guide.desc || ''
            }
            onChange={(event) =>
              updateField(
                'desc',
                event.target.value
              )
            }
          />

        </div>

      </div>

      <div className="admin-section">

        <div className="admin-section-header">

          <h2>
            Guide Sections
          </h2>

          <button
            type="button"
            onClick={
              onAddSection
            }
            className="admin-secondary-button"
          >
            + Add Section
          </button>

        </div>

        {(guide.content || []).map(
          (
            section,
            sectionIndex
          ) => (
            <div
              className="admin-content-section"
              key={sectionIndex}
            >

              <div className="admin-section-header">

                <strong>
                  Section{' '}
                  {sectionIndex + 1}
                </strong>

                <button
                  type="button"
                  onClick={() =>
                    onDeleteSection(
                      sectionIndex
                    )
                  }
                  className="admin-danger-button"
                >
                  Delete Section
                </button>

              </div>

              <div className="admin-field">

                <label>
                  Section Heading
                </label>

                <input
                  value={
                    section.heading ||
                    ''
                  }
                  onChange={(event) =>
                    onUpdateSectionHeading(
                      sectionIndex,
                      event.target
                        .value
                    )
                  }
                />

              </div>

              {(
                section.paragraphs ||
                []
              ).map(
                (
                  paragraph,
                  paragraphIndex
                ) => (
                  <div
                    className="admin-paragraph-row"
                    key={
                      paragraphIndex
                    }
                  >

                    <div className="admin-field">

                      <label>
                        {isVideoParagraph(
                          paragraph
                        )
                          ? '🎥 Video URL'
                          : `Paragraph ${
                              paragraphIndex +
                              1
                            }`}
                      </label>

                      <textarea
                        rows={
                          isVideoParagraph(
                            paragraph
                          )
                            ? 2
                            : 5
                        }
                        value={
                          paragraph ||
                          ''
                        }
                        onChange={(
                          event
                        ) =>
                          onUpdateParagraph(
                            sectionIndex,
                            paragraphIndex,
                            event.target
                              .value
                          )
                        }
                      />

                      {isVideoParagraph(
                        paragraph
                      ) && (
                        <p className="admin-video-hint">
                          {toEmbedUrl(
                            getVideoUrlFromParagraph(
                              paragraph
                            )
                          )
                            ? '✅ Valid YouTube/Vimeo link'
                            : `⚠️ Add a full video URL after ${VIDEO_PREFIX}`}
                        </p>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteParagraph(
                          sectionIndex,
                          paragraphIndex
                        )
                      }
                      className="admin-danger-button"
                    >
                      Delete
                    </button>

                  </div>
                )
              )}

              <div className="admin-inline-actions">

                <button
                  type="button"
                  onClick={() =>
                    onAddParagraph(
                      sectionIndex
                    )
                  }
                  className="admin-secondary-button"
                >
                  + Paragraph
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onAddVideo(
                      sectionIndex
                    )
                  }
                  className="admin-secondary-button"
                >
                  🎥 + Video
                </button>

              </div>

            </div>
          )
        )}

      </div>

      <div className="admin-actions">

        {!isNew && (
          <button
            type="button"
            onClick={
              onDelete
            }
            className="admin-danger-button"
            disabled={saving}
          >
            Delete Guide
          </button>
        )}

        {isNew && (
          <button
            type="button"
            onClick={
              onCancel
            }
            className="admin-secondary-button"
            disabled={saving}
          >
            Cancel
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          className="admin-primary-button"
          disabled={saving}
        >
          {saving
            ? 'Saving...'
            : isNew
              ? 'Save New Guide'
              : 'Save Everything'}
        </button>

      </div>

    </>
  )
}

export default AdminPage