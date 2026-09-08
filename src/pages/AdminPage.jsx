import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import './AdminPage.css'

import { gamesData } from '../data/gamesData'
import {
  applyCMSOverrides,
  cmsDeletedGuidesKey,
  cmsDescKey,
  cmsGuidesKey,
  cmsHeadingKey,
  cmsKey,
  cmsStructureKey,
  cmsTitleKey,
  fetchCMSContent,
} from '../cms/cmsContent'
import {
  VIDEO_PREFIX,
  isVideoParagraph,
  getVideoUrlFromParagraph,
  toEmbedUrl,
} from '../utils/videoEmbed'

const EMPTY_GUIDE = {
  icon: '📖',
  title: '',
  desc: '',
  content: [
    {
      heading: 'Introduction',
      paragraphs: ['Write your guide content here.'],
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

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [content, setContent] = useState({})

  const [selectedGame, setSelectedGame] = useState('genshin')
  const [selectedGuide, setSelectedGuide] = useState(0)

  const [isCreatingGuide, setIsCreatingGuide] = useState(false)

  const [newGuide, setNewGuide] = useState(() =>
    cloneGuide(EMPTY_GUIDE)
  )

  /*
   * ============================================================
   * EXISTING GUIDE EDITOR DRAFT
   *
   * IMPORTANT:
   * The editor no longer edits values directly through
   * mergedGames/currentGuide on every keystroke.
   *
   * This separate draft makes typing stable and reliable.
   * Changes are saved only when the user presses Save.
   * ============================================================
   */

  const [editorDraft, setEditorDraft] = useState(null)

  /*
   * ============================================================
   * MERGED GAME DATA
   * ============================================================
   */

  const mergedGames = useMemo(() => {
    return Object.values(
      applyCMSOverrides(gamesData, content)
    )
  }, [content])

  const game = useMemo(() => {
    return (
      mergedGames.find(
        (item) => item.slug === selectedGame
      ) || mergedGames[0]
    )
  }, [mergedGames, selectedGame])

  const currentGuide =
    !isCreatingGuide && game?.guides
      ? game.guides[selectedGuide]
      : null

  const isEditingCMSGuide =
    !isCreatingGuide &&
    !!currentGuide?.cmsGuideId

  /*
   * ============================================================
   * KEEP SELECTED GUIDE INDEX VALID
   * ============================================================
   */

  useEffect(() => {
    if (isCreatingGuide) {
      return
    }

    const guideCount = game?.guides?.length || 0

    if (guideCount === 0) {
      setSelectedGuide(0)
      return
    }

    if (selectedGuide >= guideCount) {
      setSelectedGuide(guideCount - 1)
      return
    }

    if (selectedGuide < 0) {
      setSelectedGuide(0)
    }
  }, [
    game,
    selectedGuide,
    isCreatingGuide,
  ])

  /*
   * ============================================================
   * LOAD CURRENT GUIDE INTO EDITOR DRAFT
   *
   * This runs when changing game/guide or when a saved change
   * causes the actual guide data to change.
   * ============================================================
   */

  useEffect(() => {
    if (isCreatingGuide) {
      setEditorDraft(null)
      return
    }

    if (!currentGuide) {
      setEditorDraft(null)
      return
    }

    setEditorDraft(cloneGuide(currentGuide))
  }, [
    selectedGame,
    selectedGuide,
    isCreatingGuide,
    currentGuide?.cmsGuideId,
    currentGuide?.cmsBuiltInGuideIndex,
  ])

  /*
   * ============================================================
   * SESSION CHECK
   * ============================================================
   */

  useEffect(() => {
    let active = true

    async function checkSession() {
      try {
        const response = await fetch(
          '/api/admin/check',
          {
            credentials: 'include',
            cache: 'no-store',
          }
        )

        const data = await response.json()

        if (active) {
          setAuthenticated(
            data?.authenticated === true
          )
        }
      } catch {
        if (active) {
          setAuthenticated(false)
        }
      } finally {
        if (active) {
          setCheckingSession(false)
        }
      }
    }

    checkSession()

    return () => {
      active = false
    }
  }, [])

  /*
   * ============================================================
   * LOAD CMS CONTENT
   * ============================================================
   */

  async function loadContent() {
    try {
      const data = await fetchCMSContent()
      setContent(data || {})
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to load CMS content.'
      )
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadContent()
    }
  }, [authenticated])

  /*
   * ============================================================
   * LOGIN
   * ============================================================
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
      const response = await fetch(
        '/api/admin/login',
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password,
          }),
        }
      )

      const data = await response.json()

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
      setMessage('Login successful.')
    } catch {
      setLoginError(
        'Unable to connect to the server.'
      )
    }
  }

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Ignore logout network errors.
    }

    setAuthenticated(false)
    setContent({})
    setEditorDraft(null)
    setMessage('')
    setIsCreatingGuide(false)
  }

  /*
   * ============================================================
   * CONTENT HELPERS
   * ============================================================
   */

  function getValue(key, fallback = '') {
    return content[key] !== undefined
      ? content[key]
      : fallback
  }

  function updateLocalContent(key, value) {
    setContent((previous) => ({
      ...previous,
      [key]: value,
    }))
  }

  async function saveContentItem(
    key,
    value
  ) {
    const response = await fetch(
      '/api/admin/content',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
        }),
      }
    )

    if (!response.ok) {
      let errorMessage =
        'Failed to save content.'

      try {
        const data = await response.json()

        if (data?.error) {
          errorMessage = data.error
        }
      } catch {
        // Ignore invalid JSON.
      }

      throw new Error(errorMessage)
    }

    updateLocalContent(key, value)
  }

  /*
   * ============================================================
   * CREATE NEW GUIDE
   * ============================================================
   */

  function startNewGuide() {
    setIsCreatingGuide(true)

    setNewGuide(
      cloneGuide({
        ...EMPTY_GUIDE,
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
      })
    )

    setEditorDraft(null)
    setMessage('')
  }

  function cancelNewGuide() {
    setIsCreatingGuide(false)
    setEditorDraft(null)
    setMessage('')
  }

  function updateNewGuideField(
    field,
    value
  ) {
    setNewGuide((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function updateNewSectionHeading(
    sectionIndex,
    value
  ) {
    setNewGuide((previous) => ({
      ...previous,
      content: previous.content.map(
        (section, index) =>
          index === sectionIndex
            ? {
                ...section,
                heading: value,
              }
            : section
      ),
    }))
  }

  function updateNewParagraph(
    sectionIndex,
    paragraphIndex,
    value
  ) {
    setNewGuide((previous) => ({
      ...previous,
      content: previous.content.map(
        (section, index) => {
          if (index !== sectionIndex) {
            return section
          }

          return {
            ...section,
            paragraphs:
              section.paragraphs.map(
                (paragraph, index2) =>
                  index2 === paragraphIndex
                    ? value
                    : paragraph
              ),
          }
        }
      ),
    }))
  }

  function addNewSection() {
    setNewGuide((previous) => ({
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
    }))
  }

  function deleteNewSection(
    sectionIndex
  ) {
    setNewGuide((previous) => ({
      ...previous,
      content: previous.content.filter(
        (_, index) =>
          index !== sectionIndex
      ),
    }))
  }

  function addNewParagraph(
    sectionIndex
  ) {
    setNewGuide((previous) => ({
      ...previous,
      content: previous.content.map(
        (section, index) =>
          index === sectionIndex
            ? {
                ...section,
                paragraphs: [
                  ...(section.paragraphs || []),
                  'Write your paragraph here.',
                ],
              }
            : section
      ),
    }))
  }

  function addNewVideo(
    sectionIndex
  ) {
    setNewGuide((previous) => ({
      ...previous,
      content: previous.content.map(
        (section, index) =>
          index === sectionIndex
            ? {
                ...section,
                paragraphs: [
                  ...(section.paragraphs || []),
                  `${VIDEO_PREFIX}https://www.youtube.com/watch?v=`,
                ],
              }
            : section
      ),
    }))
  }

  function deleteNewParagraph(
    sectionIndex,
    paragraphIndex
  ) {
    setNewGuide((previous) => ({
      ...previous,
      content: previous.content.map(
        (section, index) =>
          index === sectionIndex
            ? {
                ...section,
                paragraphs:
                  section.paragraphs.filter(
                    (_, index2) =>
                      index2 !== paragraphIndex
                  ),
              }
            : section
      ),
    }))
  }

  async function saveNewGuide() {
    if (!game) {
      return
    }

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
    setMessage('')

    try {
      const key = cmsGuidesKey(game.slug)

      let existingGuides = []

      if (content[key]) {
        try {
          const parsed = JSON.parse(
            content[key]
          )

          if (Array.isArray(parsed)) {
            existingGuides = parsed
          }
        } catch {
          existingGuides = []
        }
      }

      const guideToSave = {
        cmsGuideId:
          typeof crypto !== 'undefined' &&
          typeof crypto.randomUUID ===
            'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`,

        icon:
          newGuide.icon.trim() || '📖',

        title:
          newGuide.title.trim(),

        desc:
          newGuide.desc.trim(),

        content:
          newGuide.content.map(
            (section) => ({
              heading:
                section.heading.trim(),

              paragraphs:
                (section.paragraphs || []).map(
                  (paragraph) =>
                    paragraph.trim()
                ),
            })
          ),
      }

      const updatedGuides = [
        ...existingGuides,
        guideToSave,
      ]

      await saveContentItem(
        key,
        JSON.stringify(updatedGuides)
      )

      const newGuideIndex =
        game.guides?.length || 0

      setIsCreatingGuide(false)
      setSelectedGuide(newGuideIndex)

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

  /*
   * ============================================================
   * EDITOR DRAFT HELPERS
   * ============================================================
   */

  function updateEditorField(
    field,
    value
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        [field]: value,
      }
    })
  }

  function updateEditorSectionHeading(
    sectionIndex,
    value
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: previous.content.map(
          (section, index) =>
            index === sectionIndex
              ? {
                  ...section,
                  heading: value,
                }
              : section
        ),
      }
    })
  }

  function updateEditorParagraph(
    sectionIndex,
    paragraphIndex,
    value
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: previous.content.map(
          (section, index) => {
            if (index !== sectionIndex) {
              return section
            }

            return {
              ...section,
              paragraphs:
                (section.paragraphs || []).map(
                  (
                    paragraph,
                    index2
                  ) =>
                    index2 === paragraphIndex
                      ? value
                      : paragraph
                ),
            }
          }
        ),
      }
    })
  }

  function addEditorSection() {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: [
          ...(previous.content || []),
          {
            heading: 'New Section',
            paragraphs: [
              'Write your paragraph here.',
            ],
          },
        ],
      }
    })
  }

  function deleteEditorSection(
    sectionIndex
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: (
          previous.content || []
        ).filter(
          (_, index) =>
            index !== sectionIndex
        ),
      }
    })
  }

  function addEditorParagraph(
    sectionIndex
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: (
          previous.content || []
        ).map(
          (section, index) =>
            index === sectionIndex
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
    })
  }

  function addEditorVideo(
    sectionIndex
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: (
          previous.content || []
        ).map(
          (section, index) =>
            index === sectionIndex
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
    })
  }

  function deleteEditorParagraph(
    sectionIndex,
    paragraphIndex
  ) {
    setEditorDraft((previous) => {
      if (!previous) {
        return previous
      }

      return {
        ...previous,
        content: (
          previous.content || []
        ).map(
          (section, index) =>
            index === sectionIndex
              ? {
                  ...section,
                  paragraphs:
                    (
                      section.paragraphs ||
                      []
                    ).filter(
                      (_, index2) =>
                        index2 !==
                        paragraphIndex
                    ),
                }
              : section
        ),
      }
    })
  }

  /*
   * ============================================================
   * DELETE CURRENT GUIDE
   * ============================================================
   */

  async function deleteCurrentGuide() {
    if (!game || !currentGuide) {
      return
    }

    const guideTitle =
      currentGuide.title?.trim() ||
      'this guide'

    const confirmed = window.confirm(
      `Are you sure you want to delete "${guideTitle}"? This cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setSaving(true)
    setMessage('')

    try {
      /*
       * --------------------------------------------------------
       * CMS GUIDE
       * --------------------------------------------------------
       */

      if (isEditingCMSGuide) {
        const key = cmsGuidesKey(
          game.slug
        )

        let existingGuides = []

        if (content[key]) {
          try {
            const parsed = JSON.parse(
              content[key]
            )

            if (Array.isArray(parsed)) {
              existingGuides = parsed
            }
          } catch {
            existingGuides = []
          }
        }

        const cmsIndex =
          existingGuides.findIndex(
            (guide) =>
              guide?.cmsGuideId ===
              currentGuide.cmsGuideId
          )

        if (cmsIndex < 0) {
          throw new Error(
            'CMS guide could not be found.'
          )
        }

        const updatedGuides =
          existingGuides.filter(
            (_, index) =>
              index !== cmsIndex
          )

        await saveContentItem(
          key,
          JSON.stringify(updatedGuides)
        )

        const remainingGuideCount =
          game.guides?.length
            ? game.guides.length - 1
            : 0

        setSelectedGuide(
          Math.max(
            0,
            Math.min(
              selectedGuide,
              remainingGuideCount - 1
            )
          )
        )

        setEditorDraft(null)
        setIsCreatingGuide(false)

        setMessage(
          'Guide deleted successfully.'
        )

        return
      }

      /*
       * --------------------------------------------------------
       * BUILT-IN GUIDE
       * --------------------------------------------------------
       */

      const builtInGuideIndex =
        Number.isInteger(
          currentGuide.cmsBuiltInGuideIndex
        )
          ? currentGuide.cmsBuiltInGuideIndex
          : selectedGuide

      const deletedKey =
        cmsDeletedGuidesKey(
          game.slug
        )

      let deletedIndexes = []

      if (content[deletedKey]) {
        try {
          const parsed = JSON.parse(
            content[deletedKey]
          )

          if (Array.isArray(parsed)) {
            deletedIndexes = parsed
              .map((index) =>
                Number(index)
              )
              .filter((index) =>
                Number.isInteger(index)
              )
          }
        } catch {
          deletedIndexes = []
        }
      }

      if (
        !deletedIndexes.includes(
          builtInGuideIndex
        )
      ) {
        deletedIndexes = [
          ...deletedIndexes,
          builtInGuideIndex,
        ].sort((a, b) => a - b)
      }

      await saveContentItem(
        deletedKey,
        JSON.stringify(deletedIndexes)
      )

      setSelectedGuide(
        Math.max(
          0,
          selectedGuide - 1
        )
      )

      setEditorDraft(null)
      setIsCreatingGuide(false)

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
   * ============================================================
   * SAVE CMS GUIDE
   * ============================================================
   */

  async function saveCMSGuide() {
    if (!game || !currentGuide || !editorDraft) {
      return
    }

    if (!editorDraft.title.trim()) {
      setMessage(
        'Please enter a guide title.'
      )
      return
    }

    if (!editorDraft.desc.trim()) {
      setMessage(
        'Please enter a guide description.'
      )
      return
    }

    setSaving(true)
    setMessage('')

    try {
      const key = cmsGuidesKey(
        game.slug
      )

      let existingGuides = []

      if (content[key]) {
        try {
          const parsed = JSON.parse(
            content[key]
          )

          if (Array.isArray(parsed)) {
            existingGuides = parsed
          }
        } catch {
          existingGuides = []
        }
      }

      const cmsIndex =
        existingGuides.findIndex(
          (guide) =>
            guide?.cmsGuideId ===
            currentGuide.cmsGuideId
        )

      if (cmsIndex < 0) {
        throw new Error(
          'CMS guide could not be found.'
        )
      }

      const updatedGuide = {
        ...existingGuides[cmsIndex],

        cmsGuideId:
          currentGuide.cmsGuideId,

        icon:
          editorDraft.icon?.trim() ||
          '📖',

        title:
          editorDraft.title?.trim() ||
          '',

        desc:
          editorDraft.desc?.trim() ||
          '',

        content:
          Array.isArray(
            editorDraft.content
          )
            ? editorDraft.content.map(
                (section) => ({
                  heading:
                    section?.heading?.trim() ||
                    '',

                  paragraphs:
                    Array.isArray(
                      section?.paragraphs
                    )
                      ? section.paragraphs.map(
                          (paragraph) =>
                            paragraph?.trim() ||
                            ''
                        )
                      : [],
                })
              )
            : [],
      }

      const updatedGuides = [
        ...existingGuides,
      ]

      updatedGuides[cmsIndex] =
        updatedGuide

      await saveContentItem(
        key,
        JSON.stringify(updatedGuides)
      )

      setMessage(
        'Guide updated successfully.'
      )
    } catch (error) {
      setMessage(
        error?.message ||
          'Failed to update guide.'
      )
    } finally {
      setSaving(false)
    }
  }

  /*
   * ============================================================
   * SAVE EXISTING GUIDE
   * ============================================================
   */

  async function saveExistingGuide() {
    if (
      !game ||
      !currentGuide ||
      !editorDraft
    ) {
      return
    }

    /*
     * CMS GUIDE
     */

    if (isEditingCMSGuide) {
      await saveCMSGuide()
      return
    }

    /*
     * BUILT-IN GUIDE
     */

    setSaving(true)
    setMessage('')

    try {
      /*
       * Always use the ORIGINAL guide index.
       */

      const guideIndex =
        currentGuide.cmsBuiltInGuideIndex ??
        selectedGuide

      const titleKey =
        cmsTitleKey(
          game.slug,
          guideIndex
        )

      const descKey =
        cmsDescKey(
          game.slug,
          guideIndex
        )

      const structureKey =
        cmsStructureKey(
          game.slug,
          guideIndex
        )

      const title =
        editorDraft.title || ''

      const desc =
        editorDraft.desc || ''

      const structure =
        JSON.stringify(
          editorDraft.content || []
        )

      /*
       * Save title.
       */

      await saveContentItem(
        titleKey,
        title
      )

      /*
       * Save description.
       */

      await saveContentItem(
        descKey,
        desc
      )

      /*
       * Save complete structure.
       */

      await saveContentItem(
        structureKey,
        structure
      )

      /*
       * Save individual section headings
       * and paragraphs.
       */

      let parsedStructure = []

      try {
        parsedStructure =
          JSON.parse(structure)
      } catch {
        parsedStructure = []
      }

      if (
        !Array.isArray(
          parsedStructure
        )
      ) {
        parsedStructure = []
      }

      for (
        let sectionIndex = 0;
        sectionIndex <
        parsedStructure.length;
        sectionIndex += 1
      ) {
        const section =
          parsedStructure[
            sectionIndex
          ]

        const headingKey =
          cmsHeadingKey(
            game.slug,
            guideIndex,
            sectionIndex
          )

        await saveContentItem(
          headingKey,
          section?.heading || ''
        )

        for (
          let paragraphIndex = 0;
          paragraphIndex <
          (
            section?.paragraphs ||
            []
          ).length;
          paragraphIndex += 1
        ) {
          const paragraphKey =
            cmsKey(
              game.slug,
              guideIndex,
              sectionIndex,
              paragraphIndex
            )

          await saveContentItem(
            paragraphKey,
            section.paragraphs[
              paragraphIndex
            ] || ''
          )
        }
      }

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

  /*
   * ============================================================
   * GAME / GUIDE SELECTION
   * ============================================================
   */

  function handleGameChange(event) {
    const slug = event.target.value

    setSelectedGame(slug)
    setSelectedGuide(0)
    setEditorDraft(null)
    setIsCreatingGuide(false)
    setMessage('')
  }

  function handleGuideChange(event) {
    setSelectedGuide(
      Number(event.target.value)
    )

    setEditorDraft(null)
    setIsCreatingGuide(false)
    setMessage('')
  }

  /*
   * ============================================================
   * RENDER: CHECKING SESSION
   * ============================================================
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

  /*
   * ============================================================
   * RENDER: LOGIN
   * ============================================================
   */

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
   * ============================================================
   * RENDER: ADMIN EDITOR
   * ============================================================
   */

  const editorGuide =
    isCreatingGuide
      ? newGuide
      : editorDraft

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
              GameNexa CMS
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
                .includes('could not')
                ? 'admin-error'
                : 'admin-success'
            }
          >
            {message}
          </div>
        )}

        <div className="admin-card">

          <div className="admin-editor-toolbar">

            <div>
              <h1>
                {isCreatingGuide
                  ? 'Create New Guide'
                  : 'Guide Editor'}
              </h1>

              <p>
                Manage GameNexa guide content.
              </p>
            </div>

            {!isCreatingGuide && (
              <button
                type="button"
                onClick={startNewGuide}
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
                value={selectedGame}
                onChange={handleGameChange}
                disabled={isCreatingGuide}
              >
                {mergedGames.map(
                  (item) => (
                    <option
                      key={item.slug}
                      value={item.slug}
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
                onChange={handleGuideChange}
                disabled={isCreatingGuide}
              >
                {!isCreatingGuide &&
                  game?.guides?.map(
                    (
                      item,
                      index
                    ) => (
                      <option
                        key={
                          item.cmsGuideId ||
                          `${game.slug}-${index}`
                        }
                        value={index}
                      >
                        {index + 1}.{' '}
                        {item.title}
                        {item.cmsGuideId
                          ? ' (CMS)'
                          : ''}
                      </option>
                    )
                  )}

                {isCreatingGuide && (
                  <option value="">
                    New Guide
                  </option>
                )}
              </select>

            </div>

          </div>

          {isCreatingGuide ? (
            <>
              <div className="admin-section">

                <h2>
                  New Guide Details
                </h2>

                <div className="admin-field">

                  <label>
                    Icon
                  </label>

                  <input
                    type="text"
                    value={newGuide.icon}
                    onChange={(event) =>
                      updateNewGuideField(
                        'icon',
                        event.target.value
                      )
                    }
                    placeholder="📖"
                  />

                </div>

                <div className="admin-field">

                  <label>
                    Guide Title
                  </label>

                  <input
                    type="text"
                    value={newGuide.title}
                    onChange={(event) =>
                      updateNewGuideField(
                        'title',
                        event.target.value
                      )
                    }
                    placeholder="Enter guide title"
                  />

                </div>

                <div className="admin-field">

                  <label>
                    Description
                  </label>

                  <textarea
                    value={newGuide.desc}
                    onChange={(event) =>
                      updateNewGuideField(
                        'desc',
                        event.target.value
                      )
                    }
                    placeholder="Enter guide description"
                    rows={4}
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
                    onClick={addNewSection}
                    className="admin-secondary-button"
                  >
                    + Add Section
                  </button>

                </div>

                {newGuide.content.map(
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
                            deleteNewSection(
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
                          type="text"
                          value={
                            section.heading
                          }
                          onChange={(event) =>
                            updateNewSectionHeading(
                              sectionIndex,
                              event.target.value
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
                                  ? '🎥 Video (paste YouTube or Vimeo link after [video])'
                                  : `Paragraph ${paragraphIndex + 1}`}
                              </label>

                              <textarea
                                value={
                                  paragraph
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateNewParagraph(
                                    sectionIndex,
                                    paragraphIndex,
                                    event.target
                                      .value
                                  )
                                }
                                rows={
                                  isVideoParagraph(
                                    paragraph
                                  )
                                    ? 2
                                    : 5
                                }
                              />

                              {isVideoParagraph(
                                paragraph
                              ) &&
                                (toEmbedUrl(
                                  getVideoUrlFromParagraph(
                                    paragraph
                                  )
                                ) ? (
                                  <p className="admin-video-hint admin-video-hint-ok">
                                    ✅ Valid video link — it will show as an embedded player on the guide page.
                                  </p>
                                ) : (
                                  <p className="admin-video-hint admin-video-hint-warn">
                                    ⚠️ Paste a full YouTube or Vimeo URL after {VIDEO_PREFIX} (e.g. https://www.youtube.com/watch?v=VIDEO_ID).
                                  </p>
                                ))}

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                deleteNewParagraph(
                                  sectionIndex,
                                  paragraphIndex
                                )
                              }
                              className="admin-danger-button"
                            >
                              {isVideoParagraph(
                                paragraph
                              )
                                ? 'Delete Video'
                                : 'Delete Paragraph'}
                            </button>

                          </div>
                        )
                      )}

                      <div className="admin-inline-actions">
                        <button
                          type="button"
                          onClick={() =>
                            addNewParagraph(
                              sectionIndex
                            )
                          }
                          className="admin-secondary-button"
                        >
                          + Add Paragraph
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addNewVideo(
                              sectionIndex
                            )
                          }
                          className="admin-secondary-button"
                        >
                          🎥 + Add Video
                        </button>
                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="admin-actions">

                <button
                  type="button"
                  onClick={cancelNewGuide}
                  className="admin-secondary-button"
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveNewGuide}
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save New Guide'}
                </button>

              </div>
            </>
          ) : editorGuide ? (
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
                    type="text"
                    value={
                      editorGuide.icon ||
                      '📖'
                    }
                    onChange={(event) =>
                      updateEditorField(
                        'icon',
                        event.target.value
                      )
                    }
                    disabled={
                      !isEditingCMSGuide
                    }
                    title={
                      !isEditingCMSGuide
                        ? 'Built-in guide icons are managed in gamesData.js'
                        : ''
                    }
                  />

                </div>

                <div className="admin-field">

                  <label>
                    Guide Title
                  </label>

                  <input
                    type="text"
                    value={
                      editorGuide.title ||
                      ''
                    }
                    onChange={(event) =>
                      updateEditorField(
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
                    value={
                      editorGuide.desc ||
                      ''
                    }
                    onChange={(event) =>
                      updateEditorField(
                        'desc',
                        event.target.value
                      )
                    }
                    rows={4}
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
                      addEditorSection
                    }
                    className="admin-secondary-button"
                  >
                    + Add New Section
                  </button>

                </div>

                {(
                  editorGuide.content ||
                  []
                ).map(
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
                            deleteEditorSection(
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
                          type="text"
                          value={
                            section.heading ||
                            ''
                          }
                          onChange={(event) =>
                            updateEditorSectionHeading(
                              sectionIndex,
                              event.target.value
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
                                  ? '🎥 Video (paste YouTube or Vimeo link after [video])'
                                  : `Paragraph ${paragraphIndex + 1}`}
                              </label>

                              <textarea
                                value={
                                  paragraph ||
                                  ''
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateEditorParagraph(
                                    sectionIndex,
                                    paragraphIndex,
                                    event.target
                                      .value
                                  )
                                }
                                rows={
                                  isVideoParagraph(
                                    paragraph
                                  )
                                    ? 2
                                    : 5
                                }
                              />

                              {isVideoParagraph(
                                paragraph
                              ) &&
                                (toEmbedUrl(
                                  getVideoUrlFromParagraph(
                                    paragraph
                                  )
                                ) ? (
                                  <p className="admin-video-hint admin-video-hint-ok">
                                    ✅ Valid video link — it will show as an embedded player on the guide page.
                                  </p>
                                ) : (
                                  <p className="admin-video-hint admin-video-hint-warn">
                                    ⚠️ Paste a full YouTube or Vimeo URL after {VIDEO_PREFIX} (e.g. https://www.youtube.com/watch?v=VIDEO_ID).
                                  </p>
                                ))}

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                deleteEditorParagraph(
                                  sectionIndex,
                                  paragraphIndex
                                )
                              }
                              className="admin-danger-button"
                            >
                              {isVideoParagraph(
                                paragraph
                              )
                                ? 'Delete Video'
                                : 'Delete Paragraph'}
                            </button>

                          </div>
                        )
                      )}

                      <div className="admin-inline-actions">
                        <button
                          type="button"
                          onClick={() =>
                            addEditorParagraph(
                              sectionIndex
                            )
                          }
                          className="admin-secondary-button"
                        >
                          + Add Paragraph
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            addEditorVideo(
                              sectionIndex
                            )
                          }
                          className="admin-secondary-button"
                        >
                          🎥 + Add Video
                        </button>
                      </div>

                    </div>
                  )
                )}

              </div>

              <div className="admin-actions">

                <button
                  type="button"
                  onClick={
                    deleteCurrentGuide
                  }
                  className="admin-danger-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Deleting...'
                    : 'Delete Guide'}
                </button>

                <button
                  type="button"
                  onClick={
                    saveExistingGuide
                  }
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : isEditingCMSGuide
                      ? 'Save CMS Guide'
                      : 'Save Everything'}
                </button>

              </div>
            </>
          ) : (
            <div className="admin-empty">

              <h2>
                No Guide Selected
              </h2>

              <p>
                Select a guide or create a
                new one.
              </p>

            </div>
          )}

        </div>

        <footer className="admin-footer">
          GameNexa CMS
        </footer>

      </div>
    </div>
  )
}

export default AdminPage