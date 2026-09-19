import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { studentService } from '@/services/student.service'
import { useToastStore } from '@/stores/toast'
import { site } from '@/config/site'
import type { ApiError } from '@/types'
import type { LearnLesson, LearnProduct } from '@/types/student'

export type LearnState = 'loading' | 'ready' | 'blocked' | 'notFound' | 'error'

export function useLearn() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToastStore()

  const slug = computed(() => String(route.params.slug || ''))
  const course = ref<LearnProduct | null>(null)
  const state = ref<LearnState>('loading')
  const errorMessage = ref('')
  const marking = ref(false)

  const lessons = computed<LearnLesson[]>(
    () => course.value?.modules.flatMap((m) => m.lessons) ?? [],
  )
  const completedCount = computed(() => lessons.value.filter((l) => l.completed).length)
  const percent = computed(() =>
    lessons.value.length ? (completedCount.value / lessons.value.length) * 100 : 0,
  )

  // Sin :lessonId en la URL se retoma en la primera clase pendiente.
  const currentLesson = computed<LearnLesson | null>(() => {
    const wanted = String(route.params.lessonId || '')
    const list = lessons.value
    return list.find((l) => l.id === wanted) ?? list.find((l) => !l.completed) ?? list[0] ?? null
  })
  const currentLessonId = computed(() => currentLesson.value?.id ?? '')
  const currentModuleId = computed(
    () =>
      course.value?.modules.find((m) => m.lessons.some((l) => l.id === currentLessonId.value))
        ?.id ?? '',
  )
  const nextLesson = computed<LearnLesson | null>(() => {
    const index = lessons.value.findIndex((l) => l.id === currentLessonId.value)
    return index >= 0 ? (lessons.value[index + 1] ?? null) : null
  })

  async function load() {
    state.value = 'loading'
    errorMessage.value = ''
    try {
      course.value = await studentService.learn(slug.value)
      state.value = 'ready'
      document.title = `${course.value.product.title} — ${site.name}`
      // Se fija la clase en la URL: si quedara implícita ("la primera pendiente"),
      // al completarla el video saltaría solo a la siguiente.
      if (!route.params.lessonId && currentLesson.value) {
        router.replace({
          name: 'Learn',
          params: { slug: slug.value, lessonId: currentLesson.value.id },
        })
      }
    } catch (e) {
      const error = e as ApiError
      course.value = null
      errorMessage.value = error.message
      if (error.status === 403) state.value = 'blocked'
      else if (error.status === 404) state.value = 'notFound'
      else state.value = 'error'
    }
  }

  function findLesson(id: string): LearnLesson | undefined {
    return lessons.value.find((l) => l.id === id)
  }

  /** El reproductor avisa que la clase terminó: ya se guardó, solo se refleja en el temario. */
  function setCompleted(id: string) {
    const lesson = findLesson(id)
    if (lesson) lesson.completed = true
  }

  function setPosition(id: string, seconds: number) {
    const lesson = findLesson(id)
    if (lesson) lesson.positionSeconds = seconds
  }

  /** No se reanuda una clase ya vista ni una posición que cae en el cierre del video. */
  function canResume(id: string, seconds: number): boolean {
    const lesson = findLesson(id)
    if (!lesson) return true
    if (lesson.completed) return false
    return !lesson.durationSeconds || seconds < lesson.durationSeconds * 0.95
  }

  /** Botón "Marcar como vista": para quien vio la clase sin llegar al final. */
  async function markCurrentCompleted() {
    const lesson = currentLesson.value
    if (!lesson || lesson.completed || marking.value) return
    marking.value = true
    try {
      await studentService.saveProgress(lesson.id, lesson.positionSeconds || 0, true)
      lesson.completed = true
    } catch (e) {
      toast.error((e as ApiError).message)
    } finally {
      marking.value = false
    }
  }

  function goToLesson(id: string) {
    if (id === currentLessonId.value && route.params.lessonId) return
    router.push({ name: 'Learn', params: { slug: slug.value, lessonId: id } })
  }

  function goNext() {
    if (nextLesson.value) goToLesson(nextLesson.value.id)
  }

  // El mismo componente se reutiliza al cambiar de curso.
  watch(slug, (value, previous) => {
    if (value && value !== previous) load()
  })

  return {
    slug,
    course,
    state,
    errorMessage,
    marking,
    lessons,
    completedCount,
    percent,
    currentLesson,
    currentLessonId,
    currentModuleId,
    nextLesson,
    load,
    setCompleted,
    setPosition,
    canResume,
    markCurrentCompleted,
    goToLesson,
    goNext,
  }
}
