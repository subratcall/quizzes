import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Paper,
    Select,
    SvgIcon,
    Switch,
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import React from 'react'
import { connect } from 'react-redux'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import {
    INewPeerReviewQuestion,
    INewPeerReviewQuestionTranslation,
    INewQuizItem,
    INewQuizItemTranslation,
    INewQuizOption,
    INewQuizOptionTranslation,
    INewQuizQuery,
    INewQuizTranslation
} from '../../../common/src/types/index'
import { addItem, addOption, changeAttr, changeOrder, newQuiz, save, setEdit } from '../store/edit/actions'
import { setFilter } from '../store/filter/actions'

class QuizForm extends React.Component<any, any> {

    private itemTypes = [
        "checkbox",
        "essay",
        "open",
        "radio",
        "research-agreement",
        "scale"
    ]

    constructor(props) {
        super(props)
        this.state = {
            menuOpen: null
        }
    }

    public componentDidMount() {
        if (this.props.quiz) {
            this.props.setEdit(this.props.quiz)
        } else {
            this.props.newQuiz()
        }
    }

    public render() {
        return (
            <form onSubmit={this.submitQuiz}>
                <FormControl>
                    <InputLabel>Course</InputLabel>
                    <Select onChange={this.selectCourse} value={this.props.edit.course.id || this.props.filter.course} inputProps={{ name: 'course' }} style={{ minWidth: 350 }}>
                        {this.props.courses.map(course => <MenuItem key={course.id} value={course.id}>{course.texts[0].title}</MenuItem>) || ""}
                    </Select>
                </FormControl>
                {this.props.edit.course.languages ?
                    <div>
                        <Tabs value={this.props.filter.language} onChange={this.handleTabs} style={{ marginTop: 50 }}>
                            {this.props.edit.course.languages.map(l => <Tab value={l.id} key={l.id} label={l.id} />) || ""}
                            <Tab label="add" onClick={this.addLanguage} />
                        </Tabs>
                        {this.props.edit.course.languages.map((l, i) => (
                            this.props.filter.language === l.id && <TabContainer
                                quiz={this.props.edit}
                                handleChange={this.handleChange}
                                key={l.name}
                                language={l.id}
                                onSortEnd={this.onSortEnd}
                                addItem={this.props.addItem}
                                addOption={this.addOption}
                            />))}
                    </div> :
                    <p />
                }
                <Button id="menu" onClick={this.handleMenu}>Add item</Button>
                <Menu anchorEl={this.state.menuOpen} open={Boolean(this.state.menuOpen)} onClose={this.handleMenu}>
                    {this.itemTypes.map(type => <MenuItem key={type} value={type} onClick={this.addItem}>{type}</MenuItem>)}
                </Menu>
                <Toolbar>
                    <Typography style={{ flex: 1 }} />
                    <Button onClick={this.props.save}>save</Button>
                </Toolbar>
            </form>
        )
    }

    private addOption = item => event => {
        this.props.addOption(item)
    }

    private addItem = event => {
        this.setState({
            menuOpen: null
        })
        this.props.addItem(event.target.value)
    }

    private handleMenu = (event) => {
        this.setState({
            menuOpen: this.state.menuOpen ? null : event.currentTarget
        })
    }

    private onSortEnd = ({ oldIndex, newIndex, collection }) => {
        this.props.changeOrder(collection, oldIndex, newIndex)
    }

    private handleChange = path => event => {
        this.props.changeAttr(path, path.endsWith('correct') ? event.target.checked : event.target.value)
    }

    private addLanguage = () => {
        console.log("do you want to add language to course blaablaa")
    }

    private handleTabs = (event, value) => {
        this.props.setFilter('language', value)
    }

    private selectCourse = (event) => {
        console.log(event.target.value)
    }

    private submitQuiz = (event) => {
        event.preventDefault()
        console.log(event.target.title_fi_FI.value)
        console.log(event.target.title_en_US.value)
    }
}

const TabContainer = (props: any) => {
    const index = props.quiz.texts.findIndex(t => t.languageId === props.language)
    return (
        <div>
            <div style={{ marginTop: 50 }}>
                <TextField
                    onChange={props.handleChange(`texts[${index}].title`)}
                    label='Title'
                    value={props.quiz.texts[index].title}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                />
                <TextField
                    onChange={props.handleChange(`texts[${index}].body`)}
                    label='Body'
                    value={props.quiz.texts[index].body}
                    margin="normal"
                    fullWidth={true}
                    multiline={true}
                    rowsMax="10"
                />
            </div>
            <div style={{ marginTop: 50 }}>
                <Typography variant='subtitle1'>Items:</Typography>
                <ItemContainer
                    onSortEnd={props.onSortEnd}
                    hidden={props.hidden}
                    quiz={props.quiz}
                    language={props.language}
                    handleChange={props.handleChange}
                    handleSort={props.onSortEnd}
                    addItem={props.addItem}
                    addOption={props.addOption}
                    useDragHandle={true}
                />
            </div>
        </div>
    )
}

const ItemContainer = SortableContainer((props: any) => {
    return (
        <div>
            {props.quiz.items.sort((i1, i2) => i1.order - i2.order).map((item, i) => {
                const text = item.texts.find(t => t.languageId === props.language)
                return (
                    <SortableWrapper key={item.id || item.type + i} index={i} collection="items">
                        <Item
                            language={props.language}
                            handleChange={props.handleChange}
                            index={i}
                            handleSort={props.handleSort}
                            addOption={props.addOption}
                            collection="items"
                            textIndex={item.texts.findIndex(t => t.languageId === props.language)}
                            order={item.order}
                            validityRegex={item.validityRegex}
                            formatRegex={item.formatRegex}
                            options={item.options}
                            title={text.title}
                            body={text.body}
                            successMessage={text.successMessage}
                            failureMessage={text.failureMessage}
                        />
                    </SortableWrapper>
                )
            })}
        </div>
    )
})

class Item extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    public shouldComponentUpdate(nextProps, nextState) {
        if (nextState.expanded !== this.state.expanded) {
            return true
        }
        if (nextProps.title !== this.props.title) {
            return true
        }
        if (nextProps.body !== this.props.body) {
            return true
        }
        if (nextProps.successMessage !== this.props.successMessage) {
            return true
        }
        if (nextProps.failureMessage !== this.props.failureMessage) {
            return true
        }
        /*if (nextProps.options !== this.props.options) {
            return true
        }*/
        return false
    }


    public render() {

        console.log("item")

        return (
            <Card style={{ marginBottom: 20 }}>
                <DragHandleWrapper>
                    {!this.state.expanded ?
                        <CardHeader
                            title={this.props.title}
                            titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                        /> : ""}
                </DragHandleWrapper>
                <CardActions>
                    <IconButton onClick={this.handleExpand}>
                        <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded}>
                    <CardContent>
                        <Grid style={{ flexGrow: 1 }} container={true} spacing={16}>
                            <Grid item={true} xs={12}>
                                <Card>
                                    <CardHeader subheader="general" />
                                    <CardContent>
                                        <TextField
                                            label="title"
                                            value={this.props.title || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.order}].texts[${this.props.textIndex}].title`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="body"
                                            value={this.props.body || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.order}].texts[${this.props.textIndex}].body`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="success message"
                                            value={this.props.successMessage || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.order}].texts[${this.props.textIndex}].successMessage`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="failure message"
                                            value={this.props.failureMessage || undefined}
                                            fullWidth={true}
                                            onChange={this.props.handleChange(`items[${this.props.order}].texts[${this.props.textIndex}].failureMessage`)}
                                            multiline={true}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="validity regex"
                                            fullWidth={true}
                                            value={this.props.validityRegex || undefined}
                                            margin="normal"
                                        />
                                        <TextField
                                            label="format regex"
                                            fullWidth={true}
                                            value={this.props.formatRegex || undefined}
                                            margin="normal"
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item={true} xs={12}>
                                <Card>
                                    <CardHeader subheader="options" />
                                    <CardContent>
                                        <OptionContainer
                                            axis="xy"
                                            onSortEnd={this.props.handleSort}
                                            options={this.props.options}
                                            itemOrder={this.props.order}
                                            useDragHandle={true}
                                            addOption={this.props.addOption}
                                            language={this.props.language}
                                            handleChange={this.props.handleChange}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Collapse>
            </Card>
        )
    }

    private handleExpand = (event) => {
        this.setState({ expanded: !this.state.expanded })
    }
}

const OptionContainer = SortableContainer((props: any) => {
    return (
        <Grid container={true} spacing={16}>
            {props.options.sort((o1, o2) => o1.order - o2.order).map((option, index) => {
                const text = option.texts.find(t => t.languageId === props.language)
                return (
                    <Option
                        handleChange={props.handleChange}
                        language={props.language}
                        key={option.id || props.itemOrder + index}
                        index={index}
                        collection={`items[${props.itemOrder}].options`}
                        itemOrder={props.itemOrder}
                        textIndex={option.texts.findIndex(t => t.languageId === props.language)}
                        correct={option.correct}
                        title={text.title}
                        body={text.body}
                        successMessage={text.successMessage}
                        failureMessage={text.failureMessage}
                    />
                )
            })}
            <Grid item={true} xs={3} >
                <Paper style={{ padding: 5, marginBottom: 5 }}>
                    <Button onClick={props.addOption(props.itemOrder)} fullWidth={true}>add</Button>
                </Paper>
            </Grid>
        </Grid>
    )
})

class Option extends React.Component<any, any> {

    constructor(props) {
        super(props)
        this.state = {
            expanded: false
        }
    }

    public shouldComponentUpdate(nextProps, nextState) {
        if (nextState.expanded !== this.state.expanded) {
            return true
        }
        if (nextProps.title !== this.props.title) {
            return true
        }
        if (nextProps.body !== this.props.body) {
            return true
        }
        if (nextProps.successMessage !== this.props.successMessage) {
            return true
        }
        if (nextProps.failureMessage !== this.props.failureMessage) {
            return true
        }
        return false
    }

    public render() {

        console.log("option")

        return (
            <SortableGridItem index={this.props.index} collection={this.props.collection} size={!this.state.expanded ? 3 : 12}>
                <Card style={{ marginBottom: 20 }}>
                    <DragHandleWrapper>
                        {!this.state.expanded ? <CardHeader
                            title={this.props.title}
                            titleTypographyProps={{ variant: "subtitle1", gutterBottom: false }}
                        /> : ""}
                        <Switch checked={this.props.correct} value={!this.props.correct} color="primary" onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].correct`)} />
                    </DragHandleWrapper>
                    <CardActions>
                        <IconButton onClick={this.handleExpand}>
                            <SvgIcon><path d="M12.44 6.44L9 9.88 5.56 6.44 4.5 7.5 9 12l4.5-4.5z" /></SvgIcon>
                        </IconButton>
                    </CardActions>
                    {this.state.expanded ?
                        <CardContent>
                            <Card>
                                <CardHeader subheader="general" />
                                <CardContent>
                                    <TextField
                                        label="title"
                                        value={this.props.title || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.textIndex}].title`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="body"
                                        value={this.props.body || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.textIndex}].body`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="success message"
                                        value={this.props.successMessage || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.textIndex}].successMessage`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="failure message"
                                        value={this.props.failureMessage || undefined}
                                        fullWidth={true}
                                        onChange={this.props.handleChange(`items[${this.props.itemOrder}].options[${this.props.index}].texts[${this.props.textIndex}].failureMessage`)}
                                        multiline={true}
                                        margin="normal"
                                    />
                                </CardContent>
                            </Card>
                        </CardContent> : ""}
                </Card>
            </SortableGridItem>
        )
    }

    private handleExpand = (event) => {
        this.setState({ expanded: !this.state.expanded })
    }
}

const SortableGridItem = SortableElement((props: any) => <Grid item={true} xs={props.size}>{props.children}</Grid>)

const DragHandleWrapper = SortableHandle((props: any) => <div>{props.children}</div>)

const SortableWrapper = SortableElement((props: any) => <div>{props.children}</div>)

const mapStateToProps = (state: any) => {
    return {
        courses: state.courses,
        edit: state.edit,
        filter: state.filter,
        quizzes: state.quizzes,
        user: state.user
    }
}

const mapDispatchToProps = {
    addItem,
    addOption,
    changeAttr,
    changeOrder,
    newQuiz,
    save,
    setEdit,
    setFilter
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizForm)

