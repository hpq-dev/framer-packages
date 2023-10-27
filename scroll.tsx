import { useRef, useEffect, useContext, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import anime from "animejs"

/**
 *
 * @framerIntrinsicWidth 100
 * @framerIntrinsicHeight 100
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

export default function Scroll(options) {
    const [build, setBuild] = useState(false)
    const ref = useRef(null)
    const [value, setValue] = useState({
        id: "0",
        scroll: false,
        direction: "y",
        start: {
            x: 0,
            y: 0,
        },
        focus: false,
    })

    const [props, setProps] = useState([])

    useDirection(setValue, build)
    initScrolls(setProps, build)
    CoreScroll(props, setProps, value, setValue, build)

    usePageSize(props, setProps, build)

    if (options.scroll) useScroll(value, setValue, props, setProps, build)
    if (options.touch) useTouch(value, setValue, props, setProps)

    useEffect(() => {
        const element = document.getElementById("main")
        if (element) {
            setBuild(true)
            ref.current.style.display = "none"
        }
    }, [ref.current])

    return (
        <div
            ref={ref}
            style={{
                background: "#000",
                color: "#fff",
                textAlign: "center",
            }}
        >
            Scroll Bar System by HPQ123
        </div>
    )
}

const getScrollElements = () => document.getElementsByName(MAIN_ID_SCROLL)

const useDirection = (setValue, build) => {
    const currentTime = (): number => new Date().getTime()

    const reset = (): void =>
        setValue((prev) => {
            prev.direction = null
            prev.focus = false
            return { ...prev }
        })

    useEffect(() => {
        if (!build) return

        let x: number = 0
        let y: number = 0

        let focus: boolean = false
        let set: "x" | "y" | null = null

        let time: number = currentTime()

        const setDirection = (x: number, y: number): "x" | "y" => {
            const dir = Math.abs(y) >= Math.abs(x) ? "y" : "x"
            setValue((prev) => {
                prev.direction = dir
                return { ...prev }
            })

            return dir
        }

        const handler = ({
            clientX,
            clientY,
        }: {
            clientX: number
            clientY: number
        }): void => {
            if (!focus) return

            if (set) return

            const up: number = currentTime()
            if (up < time + 20) return

            const diffX: number = Math.abs(clientX - x)
            const diffY: number = Math.abs(clientY - y)

            set = setDirection(diffX, diffY)

            time = up
            x = clientX
            y = clientY
        }

        const handlerWheel = ({
            deltaX,
            deltaY,
        }: {
            deltaX: number
            deltaY: number
        }): void => {
            if (set) return

            setDirection(deltaX, deltaY)

            setTimeout(
                () =>
                    setValue((prev) => {
                        prev.direction = null
                        return { ...prev }
                    }),
                100
            )
        }

        const handlerClick = ({
            clientX,
            clientY,
        }: {
            clientX: number
            clientY: number
        }): void => {
            if (focus) return

            x = clientX
            y = clientY
            time = currentTime()
            focus = true
            set = null

            setValue((prev) => {
                prev.direction = null
                prev.start = {
                    x: clientX,
                    y: clientY,
                }
                prev.focus = true
                return { ...prev }
            })
        }

        const handlerClickLeave = (): void => {
            reset()
            focus = false

            set = null
        }

        window.addEventListener("mousemove", handler)
        window.addEventListener("wheel", handlerWheel)
        window.addEventListener("mousedown", handlerClick)
        window.addEventListener("mouseup", handlerClickLeave)

        return () => {
            window.removeEventListener("mousemove", handler)
            window.removeEventListener("wheel", handlerWheel)
            window.removeEventListener("mousedown", handlerClick)
            window.removeEventListener("mouseup", handlerClickLeave)
        }
    }, [build])
}

const useResizeWindow = () => {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0,
    })

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowSize
}

const initScrolls = (setProps, build) => {
    useEffect(() => {
        if (!build) return

        const elements = getScrollElements()

        elements.forEach((element, i) => {
            element.style.position = "relative"
            element.style.overflow = "hidden"

            const divToAdd = document.createElement("div")
            divToAdd.id = element.id = String(i + 1)

            divToAdd.style.transform = `translate(0px, 0px)`

            setProps((prev) => {
                prev.push({
                    ...initProps,
                    outer: {
                        x:
                            element.offsetWidth < window.innerWidth
                                ? element.offsetWidth
                                : window.innerWidth,
                        y:
                            element.offsetHeight < window.innerHeight
                                ? element.offsetHeight
                                : window.innerHeight,
                    },
                    page: {
                        x: element.offsetWidth,
                        y: element.offsetHeight,
                    },
                    pageElement: divToAdd,
                })
                return [...prev]
            })

            while (element.firstChild) {
                divToAdd.appendChild(element.firstChild)
            }
            element.appendChild(divToAdd)

            divToAdd.style.position = "relative"
            divToAdd.className = MAIN_ID_SCROLL + String(i + 1)
        })

        if (typeof document !== "undefined") {
            const style = document.createElement("style")

            style.innerHTML = `
                body::-webkit-scrollbar { display: none; }
                body { -ms-overflow-style: none; }
                body { 
                    scrollbar-width: none; 
                    overflow: hidden;
                }
            `

            document.head.appendChild(style)
        }
    }, [build])
}

const CoreScroll = (props, setProps, value, setValue, build) => {
    const { direction } = value

    useEffect(() => {
        if (!build) return

        const elements = getScrollElements()

        const handlerScroll = (currentTarget, id) => {
            try {
                if (props[id].direction !== direction) return
                if (new Date().getTime() - setDefault.id < 2) return

                setDefault = {
                    id: new Date().getTime(),
                    children: currentTarget,
                }

                setValue((prev) => {
                    prev.id = String(id + 1)
                    return { ...prev }
                })
            } catch {}
        }

        elements.forEach((element, i) => {
            element.addEventListener("mousemove", ({ currentTarget }) =>
                handlerScroll(currentTarget, i)
            )
        })

        return () => {
            elements.forEach((element, i) => {
                element.removeEventListener("mousemove", ({ currentTarget }) =>
                    handlerScroll(currentTarget, i)
                )
            })
        }
    }, [props, build])
}

function extractTranslateValues(transform) {
    const values = transform.match(/translate\((-?\d+)px, (-?\d+)px\)/)
    if (values) {
        const x = parseInt(values[1])
        const y = parseInt(values[2])
        return [x, y]
    }
    return [0, 0]
}

const updatePagePosition = (props) => {
    const { x, y, pageElement } = props

    const currentPos = extractTranslateValues(pageElement.style.transform)
    const currentX = Math.abs(currentPos[0])
    const currentY = Math.abs(currentPos[1])

    if (currentAnim) {
        currentAnim.pause()
    }

    currentAnim = anime({
        targets: pageElement,
        translateX: -x,
        translateY: -y,
        duration: 1000,
        easing: "linear",
        complete: () => (currentAnim = null),
    })
}

const useScroll = (value, setValue, props, setProps, build) => {
    const { id } = value
    const i = parseInt(id) - 1

    const limit = (
        t: "x" | "y",
        value: number,
        inner: { x: number; y: number },
        outer: { x: number; y: number }
    ) => {
        const max = Math.abs(inner[t] - outer[t])
        return value < 0 ? 0 : value > max ? max : value
    }

    const setDirection = (x: number, y: number) => {
        setValue((prev) => {
            prev.direction = y > x ? "y" : "x"
            return { ...prev }
        })
    }

    const setScroll = (
        id,
        x: number,
        y: number,
        addX: number = 0,
        addY: number = 0
    ) => {
        setProps((prev) => {
            const { inner, page, direction } = prev[id]

            setDirection(addX, addY)

            if (direction === "y") prev[id].y = limit("y", y, inner, page)
            else prev[id].x = limit("x", x, inner, page)

            updatePagePosition(prev[id])
            return [...prev]
        })
    }

    useEffect(() => {
        if (!build) return

        const hendler = ({ deltaY }: { deltaY: number }) => {
            setProps((prev) => {
                if (prev[i].pageElement.id !== id) return prev
                if (prev[i].direction !== "y") return prev
                prev[i].y = limit(
                    "y",
                    prev[i].y + deltaY,
                    prev[i].inner,
                    prev[i].page
                )

                updatePagePosition(prev[i])
                return [...prev]
            })
        }
        window.addEventListener("wheel", hendler)
        return () => window.removeEventListener("wheel", hendler)
    }, [id, build])

    useEffect(() => {
        if (!build) return

        const elements = getScrollElements()

        elements.forEach((_, x) =>
            setProps((prev) => {
                prev[x].setScroll = setScroll
                return [...prev]
            })
        )
    }, [build])
}

const useTouch = (value, setValue, props, setProps) => {
    const { scroll, id } = value
    const i = parseInt(id) - 1

    const [move, setMove] = useState<boolean>(false)

    const [touch, setTouch] = useState({
        x: 0,
        y: 0,
    })

    useEffect(() => {
        if (value.focus) {
            try {
                const { pageElement, direction } = props[i]

                if (!value.focus) return

                if (id !== pageElement.id) return

                setValue((prev) => {
                    if (prev.direction !== direction) return prev

                    setTouch((_prev) => {
                        const { x, y } = prev.start
                        _prev.x = x
                        _prev.y = y
                        return { ..._prev }
                    })
                    prev.focus = true
                    return { ...prev }
                })
                setMove(true)
            } catch {}
        } else setMove(false)
    }, [value.focus])

    useEffect(() => {
        const handler = ({ clientX, clientY }: MouseEvent) => {
            if (!move || scroll) return

            const { setScroll, x, y } = props[i]

            const speed: [number, number] = [
                2 + Math.abs(touch.x - clientX) / 100,
                1 + Math.abs(touch.y - clientY) / 50,
            ]

            setScroll(
                i,
                x + (touch.x - clientX) * speed[0],
                y + (touch.y - clientY) * speed[1],
                touch.x - clientX,
                touch.y - clientY
            )

            setTouch((prev) => {
                prev.x = clientX
                prev.y = clientY
                return { ...prev }
            })
        }

        window.addEventListener("mousemove", handler)
        return () => window.removeEventListener("mousemove", handler)
    }, [props, value.direction, move, touch, scroll])
}

const usePageSize = (props, setProps, build) => {
    useEffect(() => {
        if (!build) return

        const elements = getScrollElements()
        const timer = setInterval(() => {
            elements.forEach((element, i) => {
                const { height } = element.getBoundingClientRect()
                const width = element.scrollWidth

                setProps((prev) => {
                    const { inner, outer, page, pageElement } = prev[i]

                    if (inner.x === width && inner.y === height) return prev

                    pageElement.style.width = page.x + "px"
                    pageElement.style.height = page.y + "px"

                    prev[i].inner = {
                        x: width,
                        y: height,
                    }
                    prev[i].direction = prev[i].x > outer.x ? "x" : "y"

                    if (prev[i].direction === "y")
                        element.style.height = outer.y + "px"
                    else element.style.width = outer.x + "px"

                    return [...prev]
                })
            })
        }, 300)

        return () => clearInterval(timer)
    }, [build])

    // return <motion.div
    //     ref={ref}
    //     animate={direction === 'y' ? { y: -y } : { x: -x }}
    //     transition={{ ease: [0.07, 0.82, 0.35, 1], duration: 1.5 }}
    //     style={{
    //         position: 'relative'
    //     }}
    // >
    //     {children}
    // </motion.div>
}

const MAIN_ID_SCROLL: string = "Scroll"

const initProps = {
    x: 0,
    y: 0,
    setScroll: (x: number, y: number) => {},
    inner: {
        x: 0,
        y: 0,
    },
    outer: {
        x: 0,
        y: 0,
    },
    page: {
        x: 0,
        y: 0,
    },
    pageElement: null,
    direction: "y",
}

const def = {
    id: 0,
    children: null,
}

let setDefault = def
let currentAnim = null

addPropertyControls(Scroll, {
    scroll: {
        type: ControlType.Boolean,
        title: "Scroll",
        defaultValue: 0,
    },
    touch: {
        type: ControlType.Boolean,
        title: "Touchpad",
        defaultValue: 0,
    },
})
